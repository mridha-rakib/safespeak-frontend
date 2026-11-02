"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import {
  IconAlertTriangle,
  IconArrowRight,
  IconBuildingBank,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconDownload,
  IconExternalLink,
  IconFolderFilled,
  IconGavel,
  IconPhoto,
  IconPlus,
  IconShieldFilled,
  IconX,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { ConsentRequiredCard } from "@/components/consent/consent-required-card";
import {
  ConsentRequiredError,
  type ConsentRequirement,
  grantConsent,
} from "@/lib/consent";
import type { DashboardCardFlowId } from "@/lib/dashboard-card-flows";
import {
  type MediaAssetItem,
  getMediaAssetImageUrl,
  listPublishedMediaAssets,
} from "@/lib/media-assets";
import {
  analyzeScamEmail,
  analyzeScamScreenshot,
  analyzeScamText,
  checkScamUrl,
  generateScamReportDraft,
  redactScamContent,
  submitScamReport,
} from "@/lib/scamshield-client";
import {
  getScamShieldFlowState,
  mergeScamShieldFlowState,
  useScamShieldFlowState,
} from "@/lib/scamshield-flow";

import { interFont } from "./dashboard-shared";

const SCAM_SHIELD_MEDIA_ASSET_CATEGORY = "Cybersecurity";
const SCAM_SHIELD_EVIDENCE_ACCEPT =
  "image/*,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const SCAM_SHIELD_ALLOWED_EVIDENCE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".pdf",
  ".doc",
  ".docx",
]);
const SCAM_SHIELD_ALLOWED_EVIDENCE_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function getEvidenceFileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function getEvidenceFileExtension(fileName: string): string {
  return fileName.toLowerCase().match(/\.[^.]+$/)?.[0] ?? "";
}

function isSupportedScamShieldEvidenceFile(file: File): boolean {
  return (
    file.type.startsWith("image/") ||
    SCAM_SHIELD_ALLOWED_EVIDENCE_MIME_TYPES.has(file.type) ||
    SCAM_SHIELD_ALLOWED_EVIDENCE_EXTENSIONS.has(
      getEvidenceFileExtension(file.name)
    )
  );
}

function formatEvidenceFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 102.4) / 10} KB`;
  }

  return `${Math.round((size / 1024 / 1024) * 10) / 10} MB`;
}

function normalizeScamShieldUrlInput(value: string): string {
  const trimmedValue = value.trim();

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
}

function isValidScamShieldUrl(value: string): boolean {
  try {
    const url = new URL(normalizeScamShieldUrlInput(value));

    return Boolean(url.hostname.includes("."));
  } catch {
    return false;
  }
}

function getDraftReportValue(
  draftReport: Record<string, unknown> | undefined,
  key: string,
  fallback: string
): string {
  const value = draftReport?.[key];

  return typeof value === "string" && value.trim() ? value : fallback;
}

function getRecord(
  value: unknown
): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function getStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function includesAnyText(value: string, patterns: string[]): boolean {
  const normalizedValue = value.toLowerCase();
  return patterns.some((pattern) => normalizedValue.includes(pattern));
}

type ScamShieldActionCard = {
  id: "bank" | "accc" | "reportCyber";
  title: string;
  body: string;
  secondary?: string;
  badge?: string;
  icon: ReactNode;
  iconClassName: string;
  href: "/dashboard?view=scamshieldagency";
  cta: string;
  agency: "bank" | "accc" | "reportCyber";
};

function downloadTextFile(fileName: string, content: string) {
  if (typeof window === "undefined") {
    return;
  }

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

function parseEmailHeadersInput(raw: string): Record<string, string> | undefined {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return undefined;
  }

  const headers: Record<string, string> = {};

  lines.forEach((line) => {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex <= 0) {
      headers["Authentication-Results"] = [
        headers["Authentication-Results"],
        line,
      ]
        .filter(Boolean)
        .join("; ");
      return;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (!key || !value) {
      return;
    }

    headers[key] = headers[key]
      ? `${headers[key]}; ${value}`
      : value;
  });

  return Object.keys(headers).length ? headers : undefined;
}

function ScamShieldIntakePage({
  initialTopic,
}: {
  initialTopic?: DashboardCardFlowId;
}) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const existingState = getScamShieldFlowState();
  const evidenceFileInputRef = useRef<HTMLInputElement | null>(null);
  const [messageContent, setMessageContent] = useState(
    existingState?.inputText ?? ""
  );
  const [inputMode, setInputMode] = useState<
    "text" | "url" | "email" | "screenshot"
  >(existingState?.inputMode ?? "text");
  const [intakeError, setIntakeError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailFrom, setEmailFrom] = useState("");
  const [emailHeaders, setEmailHeaders] = useState("");
  const [selectedEvidenceFiles, setSelectedEvidenceFiles] = useState<File[]>(
    []
  );
  const [evidencePreviewUrls, setEvidencePreviewUrls] = useState<
    Record<string, string>
  >({});
  const [pendingConsentRequirement, setPendingConsentRequirement] =
    useState<ConsentRequirement | null>(null);
  const [isGrantingConsent, setIsGrantingConsent] = useState(false);
  const readyItemCount =
    selectedEvidenceFiles.length + (messageContent.trim() ? 1 : 0);
  const hasAnalyzableInput =
    inputMode === "screenshot"
      ? selectedEvidenceFiles.length > 0 || Boolean(messageContent.trim())
      : Boolean(messageContent.trim());
  const isAnalyzeDisabled =
    isAnalyzing || isGrantingConsent || !hasAnalyzableInput;

  const attachEvidenceFiles = (files: FileList | File[]) => {
    const incomingFiles = Array.from(files);

    if (!incomingFiles.length) {
      return;
    }

    const supportedFiles = incomingFiles.filter(
      isSupportedScamShieldEvidenceFile
    );
    const unsupportedFiles = incomingFiles.filter(
      (file) => !isSupportedScamShieldEvidenceFile(file)
    );

    if (unsupportedFiles.length) {
      setIntakeError(
        `Unsupported file type: ${unsupportedFiles.map((file) => file.name).join(", ")}. Upload images, screenshots, PDFs, or Word documents.`
      );
    } else {
      setIntakeError(null);
    }

    if (!supportedFiles.length) {
      return;
    }

    setSelectedEvidenceFiles((currentFiles) => {
      const existingKeys = new Set(currentFiles.map(getEvidenceFileKey));
      const nextFiles = supportedFiles.filter(
        (file) => !existingKeys.has(getEvidenceFileKey(file))
      );

      return [...currentFiles, ...nextFiles];
    });
    setInputMode("screenshot");
  };

  const removeEvidenceFile = (fileKey: string) => {
    setSelectedEvidenceFiles((currentFiles) =>
      currentFiles.filter((file) => getEvidenceFileKey(file) !== fileKey)
    );
  };

  const runAnalysis = async () => {
    const trimmedInput = messageContent.trim();
    const normalizedUrl =
      inputMode === "url"
        ? normalizeScamShieldUrlInput(trimmedInput)
        : trimmedInput;

    if (
      inputMode === "screenshot" &&
      !selectedEvidenceFiles.length &&
      !trimmedInput
    ) {
      setIntakeError(
        "Select evidence files or paste the visible message text before analysis."
      );
      return;
    }

    if (inputMode !== "screenshot" && !trimmedInput) {
      setIntakeError(
        "Add suspicious text, a URL, or an email body before analysis."
      );
      return;
    }

    if (inputMode === "url" && !isValidScamShieldUrl(trimmedInput)) {
      setIntakeError(
        "Enter a complete URL or domain, such as https://example.com."
      );
      return;
    }

    setIsAnalyzing(true);
    setIntakeError(null);

    try {
      const analysis =
        inputMode === "url"
          ? await checkScamUrl({ url: normalizedUrl })
          : inputMode === "email"
            ? await analyzeScamEmail({
                body: trimmedInput,
                subject: emailSubject.trim() || undefined,
                from: emailFrom.trim() || undefined,
                headers: parseEmailHeadersInput(emailHeaders),
                forwardedWithPermission: Boolean(emailHeaders.trim()),
                metadata: {
                  language: i18n.language,
                },
              })
            : inputMode === "screenshot"
              ? await analyzeScamScreenshot({
                  imageText: trimmedInput || undefined,
                  evidenceFiles: selectedEvidenceFiles,
                  metadata: {
                    language: i18n.language,
                  },
                })
              : await analyzeScamText({
                  text: trimmedInput,
                  language: i18n.language || "en",
                });

      mergeScamShieldFlowState({
        inputText: inputMode === "url" ? normalizedUrl : trimmedInput,
        inputMode,
        analysis,
      });
      router.push("/dashboard?view=scamshieldrisk");
    } catch (error) {
      if (error instanceof ConsentRequiredError) {
        setPendingConsentRequirement(error.requirement);
        return;
      }

      setIntakeError(
        error instanceof Error
          ? error.message
          : "Scam analysis could not be completed."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    const previewEntries = selectedEvidenceFiles
      .filter((file) => file.type.startsWith("image/"))
      .map(
        (file) => [getEvidenceFileKey(file), URL.createObjectURL(file)] as const
      );
    const nextPreviewUrls = Object.fromEntries(previewEntries);

    setEvidencePreviewUrls(nextPreviewUrls);

    return () => {
      previewEntries.forEach(([, previewUrl]) => {
        URL.revokeObjectURL(previewUrl);
      });
    };
  }, [selectedEvidenceFiles]);

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard?view=reportsubmissiondetails"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.scamShield.analyzeMessage")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <article className="mt-3 overflow-hidden rounded-[16px] border border-[#dce5f1] bg-[#f4f7fc] shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          {initialTopic === "cyber_scam" || initialTopic === "scamshield" ? (
            <div className="border-b border-[#e2eaf5] bg-white px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#3f7de0]">
                Cyber scam context
              </p>
              <p className="mt-1 text-[11px] leading-[1.55] text-[#60728a]">
                Paste suspicious text, upload a screenshot, or continue to the
                next step to review scam risk indicators.
              </p>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 p-3 sm:p-4 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-[14px] border border-[#e2eaf4] bg-white p-3 sm:p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {[
                  ["text", "Paste text"],
                  ["url", "Check URL"],
                  ["email", "Analyze email"],
                  ["screenshot", "File upload"],
                ].map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() =>
                      setInputMode(
                        mode as "text" | "url" | "email" | "screenshot"
                      )
                    }
                    className={`inline-flex h-8 items-center rounded-full px-3 text-[10px] font-bold ${
                      inputMode === mode
                        ? "bg-[#0f5d9f] text-white"
                        : "bg-[#f4f7fb] text-[#60728a]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label
                htmlFor="scam-message-content"
                className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#6f88a8]"
              >
                {inputMode === "screenshot"
                  ? "Visible text or file text correction"
                  : t("dashboard.scamShield.messageContent")}
              </label>
              {inputMode === "email" ? (
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <input
                    value={emailFrom}
                    onChange={(event) => setEmailFrom(event.target.value)}
                    placeholder="Visible sender, for example alerts@bank.example"
                    className="h-10 rounded-[11px] border border-[#dbe4ef] bg-[#f8fbff] px-3 text-[11px] text-[#1f2a3a] outline-none placeholder:text-[#9aabc0]"
                  />
                  <input
                    value={emailSubject}
                    onChange={(event) => setEmailSubject(event.target.value)}
                    placeholder="Email subject"
                    className="h-10 rounded-[11px] border border-[#dbe4ef] bg-[#f8fbff] px-3 text-[11px] text-[#1f2a3a] outline-none placeholder:text-[#9aabc0]"
                  />
                  <textarea
                    value={emailHeaders}
                    onChange={(event) => setEmailHeaders(event.target.value)}
                    rows={3}
                    placeholder="Optional: paste Authentication-Results, Reply-To, Return-Path, or forwarded header lines you have permission to share."
                    className="sm:col-span-2 rounded-[11px] border border-[#dbe4ef] bg-[#f8fbff] px-3 py-2 text-[11px] leading-[1.5] text-[#1f2a3a] outline-none placeholder:text-[#9aabc0]"
                  />
                </div>
              ) : null}
              <div className="relative mt-2">
                <textarea
                  id="scam-message-content"
                  rows={15}
                  value={messageContent}
                  onChange={(event) => setMessageContent(event.target.value)}
                  placeholder={
                    inputMode === "url"
                      ? "https://example.com/suspicious-link"
                      : inputMode === "email"
                        ? "Paste the email body and any sender details you want checked."
                        : inputMode === "screenshot"
                          ? "Optional: paste visible text if OCR or document extraction misses anything."
                          : t("dashboard.scamShield.messageContentPlaceholder")
                  }
                  className="min-h-[340px] w-full resize-none rounded-[11px] border border-[#dbe4ef] bg-[#f8fbff] px-3 py-3 text-xs leading-[1.6] text-[#1f2a3a] outline-none placeholder:text-[#9aabc0]"
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[#9db0c8]">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-[4px] border border-[#d8e2ee] bg-white">
                    <IconFolderFilled size={10} />
                  </span>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-[4px] border border-[#d8e2ee] bg-white">
                    <IconClock size={10} />
                  </span>
                </div>
              </div>
            </article>

            <aside className="space-y-3">
              {intakeError ? (
                <div className="rounded-[12px] border border-[#fde2e2] bg-[#fff5f5] px-3 py-3 text-[11px] text-[#b45353]">
                  {intakeError}
                </div>
              ) : null}
              <article
                className="rounded-[14px] border border-[#e2eaf4] bg-white p-4 text-center"
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  attachEvidenceFiles(event.dataTransfer.files);
                }}
              >
                <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#ecf4ff] text-[#0f5d9f]">
                  <IconPhoto size={20} />
                </span>
                <h3 className="mt-3 text-xl font-bold leading-[1.1] text-[#1f2a3a]">
                  {t("dashboard.scamShield.uploadScreenshotTitle")}
                </h3>
                <p className="mx-auto mt-1 max-w-[250px] text-xs leading-[1.5] text-[#7f90a6]">
                  {t("dashboard.scamShield.uploadScreenshotDescription")}
                </p>
                <label className="mt-3 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-[#0f5d9f] px-4 text-[11px] font-bold text-white">
                  <IconFolderFilled size={12} />
                  {t("dashboard.scamShield.selectFiles")}
                  <input
                    ref={evidenceFileInputRef}
                    type="file"
                    multiple
                    accept={SCAM_SHIELD_EVIDENCE_ACCEPT}
                    className="sr-only"
                    onChange={(event) => {
                      if (event.target.files) {
                        attachEvidenceFiles(event.target.files);
                      }

                      event.target.value = "";
                    }}
                  />
                </label>
                {selectedEvidenceFiles.length ? (
                  <div className="mt-3 rounded-[10px] border border-[#dce5f1] bg-[#f8fbff] px-3 py-2 text-left">
                    <p className="truncate text-[11px] font-bold text-[#1f2a3a]">
                      {selectedEvidenceFiles.length} evidence file
                      {selectedEvidenceFiles.length === 1 ? "" : "s"} attached
                    </p>
                    <p className="mt-0.5 text-[9px] text-[#7f90a6]">
                      Images use OCR. PDFs and Word documents are parsed for
                      scam text.
                    </p>
                  </div>
                ) : null}
              </article>

              <article className="rounded-[14px] border border-[#e2eaf4] bg-white p-3 sm:p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7f90a6]">
                  {t("dashboard.scamShield.attachedEvidence")}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {selectedEvidenceFiles.map((file) => {
                    const fileKey = getEvidenceFileKey(file);
                    const previewUrl = evidencePreviewUrls[fileKey];
                    const extension = getEvidenceFileExtension(file.name)
                      .replace(".", "")
                      .toUpperCase();

                    return (
                      <article
                        key={fileKey}
                        className="relative min-h-[100px] rounded-[10px] border border-[#e2eaf4] bg-[#f2f5f9] p-2"
                      >
                        <button
                          type="button"
                          onClick={() => removeEvidenceFile(fileKey)}
                          className="absolute -right-1.5 -top-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#f05151] text-white"
                          aria-label={`Remove ${file.name}`}
                        >
                          <IconX size={9} />
                        </button>
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt=""
                            className="mx-auto h-[58px] w-full rounded-[7px] object-cover"
                          />
                        ) : (
                          <div className="grid h-[58px] place-items-center rounded-[7px] bg-white text-[#0f5d9f]">
                            <IconFolderFilled size={18} />
                          </div>
                        )}
                        <p className="mt-1 truncate text-[9px] font-bold text-[#1f2a3a]">
                          {file.name}
                        </p>
                        <p className="text-[8px] font-semibold text-[#8ea2bf]">
                          {extension || "FILE"} -{" "}
                          {formatEvidenceFileSize(file.size)}
                        </p>
                      </article>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => evidenceFileInputRef.current?.click()}
                    className="grid min-h-[100px] place-items-center rounded-[10px] border border-dashed border-[#c4d2e6] bg-[#f8fbff] text-center"
                  >
                    <div>
                      <span className="mx-auto inline-flex h-5 w-5 items-center justify-center text-[#8ea2bf]">
                        <IconPlus size={14} />
                      </span>
                      <p className="mt-1 text-[9px] font-semibold text-[#8ea2bf]">
                        {t("dashboard.scamShield.addMore")}
                      </p>
                    </div>
                  </button>
                </div>
              </article>
            </aside>
          </div>

          {pendingConsentRequirement ? (
            <div className="px-3 pb-3 sm:px-4">
              <ConsentRequiredCard
                requirement={pendingConsentRequirement}
                isSubmitting={isGrantingConsent}
                onAllow={() => {
                  void (async () => {
                    setIsGrantingConsent(true);

                    try {
                      await grantConsent(
                        { process_with_ai: true },
                        pendingConsentRequirement.source
                      );
                      setPendingConsentRequirement(null);
                      await runAnalysis();
                    } catch (error) {
                      setIntakeError(
                        error instanceof Error
                          ? error.message
                          : "Consent could not be saved."
                      );
                    } finally {
                      setIsGrantingConsent(false);
                    }
                  })();
                }}
                onDecline={() => {
                  setPendingConsentRequirement(null);
                }}
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-2 border-t border-[#e2eaf5] bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <p className="text-[10px] font-medium text-[#6c7f96]">
              {readyItemCount
                ? `${readyItemCount} item${readyItemCount === 1 ? "" : "s"} ready for analysis`
                : "Add text or evidence files to start analysis"}
            </p>
            <button
              type="button"
              disabled={isAnalyzeDisabled}
              onClick={() => {
                void runAnalysis();
              }}
              className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-7 text-[11px] font-bold uppercase tracking-[0.02em] text-white shadow-[0_8px_18px_rgba(255,153,0,0.33)] ${
                isAnalyzeDisabled
                  ? "cursor-not-allowed bg-[#f5c779] opacity-70"
                  : "bg-[#ff9900]"
              }`}
            >
              <IconShieldFilled size={12} />
              {isAnalyzing
                ? "Analyzing..."
                : t("dashboard.scamShield.analyzeNow")}
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

function ScamShieldRiskPage() {
  const { t } = useTranslation();
  const flowState = useScamShieldFlowState();
  const analysis = flowState?.analysis;

  if (!analysis) {
    return (
      <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
        <div className="mx-auto w-full max-w-[1184px]">
          <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
            <Link
              href="/dashboard?view=scamshieldintake"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
            >
              <IconChevronLeft size={14} />
              {t("dashboard.scamShield.scamRiskResults")}
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-medium text-[#7b8798]"
            >
              {t("common.cancel")}
            </Link>
          </div>

          <article className="mt-3 rounded-[16px] border border-[#dce5f1] bg-white px-4 py-8 text-center shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:px-6">
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#ecf4ff] text-[#0f5d9f]">
              <IconShieldFilled size={20} />
            </span>
            <h2 className="mt-3 text-xl font-bold text-[#1f2a3a]">
              Run a ScamShield analysis first
            </h2>
            <p className="mx-auto mt-2 max-w-[520px] text-xs leading-[1.55] text-[#61748f]">
              Paste a message, check a URL, analyze an email, or upload evidence
              so ScamShield can produce real risk results for this session.
            </p>
            <Link
              href="/dashboard?view=scamshieldintake"
              className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#0f5d9f] px-6 text-[11px] font-semibold text-white"
            >
              Start analysis
              <IconArrowRight size={12} />
            </Link>
          </article>
        </div>
      </div>
    );
  }

  const riskScore =
    Math.round(Math.max(0, Math.min(100, analysis.riskScore ?? 0)) * 100) / 100;
  const riskLevel = analysis.riskLevel ?? "low";
  const confidence = analysis.confidence ?? "rule-based";
  const redFlags = analysis.redFlags?.length
    ? analysis.redFlags
    : analysis.indicators?.length
      ? analysis.indicators
      : [];
  const recommendations = analysis.recommendations?.length
    ? analysis.recommendations
    : redFlags.map(
        () =>
          "Pause, do not click links or send money, and verify through an official channel."
      );
  const extractedTextLength =
    typeof analysis.metadata?.extractedTextLength === "number"
      ? analysis.metadata.extractedTextLength
      : null;
  const extractedEntities =
    analysis.extractedEntities ?? analysis.metadata?.extractedEntities;
  const storageMode =
    typeof analysis.metadata?.storageMode === "string"
      ? analysis.metadata.storageMode
      : "server";
  const urlReputation = getRecord(analysis.metadata?.urlReputation);
  const senderAnalysis = getRecord(analysis.metadata?.senderAnalysis);
  const urlReputationSignals = getStringArray(urlReputation?.signals);
  const senderSignals = getStringArray(senderAnalysis?.signals);

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard?view=scamshieldintake"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.scamShield.scamRiskResults")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <article className="mt-3 rounded-[16px] border border-[#dce5f1] bg-[#f4f7fc] p-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-4">
          <article className="rounded-[14px] border border-[#e3eaf5] bg-white px-4 py-5 text-center sm:px-6 sm:py-6">
            <p className="text-[58px] font-black leading-none text-[#cf2f34]">
              {riskScore}%
            </p>
            <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-[#ba9ea3]">
              {riskLevel} risk | {confidence} confidence
            </p>
            <p className="mt-2 text-[26px] font-extrabold leading-none text-[#cf2f34]">
              {analysis.summary ?? "ScamShield analysis completed"}
            </p>
            <p className="mx-auto mt-2 max-w-[540px] text-xs leading-[1.5] text-[#61748f]">
              {analysis.summary ??
                `ScamShield returned ${riskLevel} risk with ${redFlags.length} indicator${redFlags.length === 1 ? "" : "s"}.`}
            </p>
            {extractedTextLength ? (
              <p className="mt-2 text-[10px] font-semibold text-[#60728a]">
                OCR text extracted: {extractedTextLength} characters
              </p>
            ) : null}
            {storageMode === "local_only" ? (
              <p className="mt-2 text-[10px] font-semibold text-[#60728a]">
                Saved locally in this browser session until you choose to share
                or sync it.
              </p>
            ) : null}
          </article>

          <div className="mt-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1f2a3a]">
              {t("dashboard.scamShield.detectedRedFlags")}
            </h3>
            <span className="inline-flex h-5 items-center rounded-full bg-[#ffe9e9] px-2 text-[9px] font-bold uppercase tracking-[0.07em] text-[#df4a4a]">
              {redFlags.length} found
            </span>
          </div>

          <div className="mt-2 space-y-2">
            {redFlags.map((flag, index) => (
              <article
                key={`${flag}-${index}`}
                className="flex items-start gap-3 rounded-xl border border-[#e2eaf4] bg-white px-3 py-3 sm:px-4"
              >
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#fff6e5] text-[#f59e0b]">
                  <IconAlertTriangle size={13} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1f2a3a]">{flag}</p>
                  <p className="mt-1 text-[11px] leading-[1.45] text-[#64748b]">
                    {recommendations[index] ??
                      t("dashboard.scamShield.highRiskDetectedBody")}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold text-[#2c66b0]">
                    {t("dashboard.scamShield.howToStaySafe")}
                    <IconArrowRight size={10} />
                  </span>
                </div>
              </article>
            ))}
            {!redFlags.length ? (
              <article className="rounded-xl border border-[#e2eaf4] bg-white px-3 py-3 text-[11px] leading-[1.55] text-[#64748b] sm:px-4">
                No clear scam red flags were detected from the supplied content.
                Keep verifying through official channels if the request feels
                unusual or involves money, passwords, identity documents, or
                account access.
              </article>
            ) : null}
          </div>

          {extractedEntities && typeof extractedEntities === "object" ? (
            <article className="mt-4 rounded-xl border border-[#dfe8f4] bg-white p-3 sm:p-4">
              <p className="text-sm font-bold text-[#1f2a3a]">
                Extracted entities
              </p>
              <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-[8px] bg-[#f8fbff] p-3 text-[10px] leading-[1.5] text-[#60728a]">
                {JSON.stringify(extractedEntities, null, 2)}
              </pre>
            </article>
          ) : null}

          {urlReputation ? (
            <article className="mt-4 rounded-xl border border-[#dfe8f4] bg-white p-3 sm:p-4">
              <p className="text-sm font-bold text-[#1f2a3a]">
                Link reputation checks
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2 text-[11px] text-[#50627a] sm:grid-cols-2">
                <p>
                  Domain: {String(urlReputation.domain ?? "Not available")}
                </p>
                <p>
                  Domain age:{" "}
                  {typeof urlReputation.domainAgeDays === "number"
                    ? `${String(urlReputation.domainAgeDays)} days`
                    : "Not available"}
                </p>
                <p>
                  TLS valid: {String(urlReputation.tlsValid ?? "Unknown")}
                </p>
                <p>
                  IP location: {String(urlReputation.ipGeolocation ?? "Not available")}
                </p>
              </div>
              {urlReputationSignals.length ? (
                <p className="mt-2 text-[11px] leading-[1.55] text-[#b45353]">
                  Reputation flags: {urlReputationSignals.join(", ")}
                </p>
              ) : null}
            </article>
          ) : null}

          {senderAnalysis ? (
            <article className="mt-4 rounded-xl border border-[#dfe8f4] bg-white p-3 sm:p-4">
              <p className="text-sm font-bold text-[#1f2a3a]">
                Sender checks
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2 text-[11px] text-[#50627a] sm:grid-cols-2">
                <p>SPF: {String(senderAnalysis.spf ?? "none")}</p>
                <p>DKIM: {String(senderAnalysis.dkim ?? "none")}</p>
                <p>DMARC: {String(senderAnalysis.dmarc ?? "none")}</p>
                <p>
                  Reply-To: {String(senderAnalysis.replyTo ?? "Not provided")}
                </p>
              </div>
              {senderSignals.length ? (
                <p className="mt-2 text-[11px] leading-[1.55] text-[#b45353]">
                  Sender flags: {senderSignals.join(", ")}
                </p>
              ) : null}
            </article>
          ) : null}

          <div className="mt-4 flex justify-center">
            <Link
              href="/dashboard?view=scamshieldassets"
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#df3c3c] px-8 text-[11px] font-semibold text-white shadow-[0_8px_18px_rgba(223,60,60,0.26)]"
            >
              <IconAlertTriangle size={12} />
              {t("dashboard.scamShield.reportThisIncident")}
            </Link>
          </div>

          <article className="mt-4 rounded-xl border border-[#dfe8f4] bg-[#edf4ff] p-3 sm:p-4">
            <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1f4f93]">
              <IconShieldFilled size={13} />
              {t("dashboard.scamShield.stayProtected")}
            </p>
            <p className="mt-1 text-[10px] leading-[1.5] text-[#4b607d]">
              {t("dashboard.scamShield.stayProtectedBody")}
            </p>
            <div className="mt-3 rounded-[4px] border border-[#f0dc9f] bg-[#fff5dd] px-2 py-1.5">
              <p className="inline-flex items-center gap-1 text-[9px] text-[#8c6d1f]">
                <IconAlertTriangle size={10} />
                {t("dashboard.scamShield.infoDisclaimer")}
              </p>
            </div>
          </article>
        </article>
      </div>
    </div>
  );
}

function ScamShieldAssetsPage() {
  const { t } = useTranslation();
  const flowState = useScamShieldFlowState();
  const [mediaAssets, setMediaAssets] = useState<MediaAssetItem[]>([]);
  const analysis = flowState?.analysis;

  useEffect(() => {
    let isMounted = true;

    void listPublishedMediaAssets(SCAM_SHIELD_MEDIA_ASSET_CATEGORY)
      .then((assets) => {
        if (isMounted) {
          setMediaAssets(assets);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMediaAssets([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const extractedEntities = getRecord(analysis?.extractedEntities);
  const entityUrls = getStringArray(extractedEntities?.urls);
  const entityOrganizations = getStringArray(extractedEntities?.organizations);
  const entityPaymentMethods = getStringArray(extractedEntities?.paymentMethods);
  const entityAccountTerms = getStringArray(extractedEntities?.accountTerms);
  const recommendations = analysis?.recommendations ?? [];
  const recommendationText = recommendations.join(" ").toLowerCase();
  const summaryText = analysis?.summary?.toLowerCase() ?? "";
  const redFlagText = (analysis?.redFlags ?? []).join(" ").toLowerCase();
  const combinedAnalysisText = [
    recommendationText,
    summaryText,
    redFlagText,
    entityOrganizations.join(" ").toLowerCase(),
    entityPaymentMethods.join(" ").toLowerCase(),
    entityAccountTerms.join(" ").toLowerCase(),
  ].join(" ");
  const shouldShowBankAction =
    (analysis?.riskScore ?? 0) >= 25 &&
    (includesAnyText(combinedAnalysisText, [
      "bank",
      "account",
      "transaction",
      "transfer",
      "payment",
      "card",
      "fraud department",
      "freeze",
      "compromise",
      "unauthorized login",
    ]) ||
      entityPaymentMethods.length > 0 ||
      entityAccountTerms.length > 0);
  const shouldShowScamwatchAction = (analysis?.riskScore ?? 0) >= 15;
  const shouldShowReportCyberAction =
    (analysis?.riskScore ?? 0) >= 25 &&
    (entityUrls.length > 0 ||
      includesAnyText(combinedAnalysisText, [
        "link",
        "url",
        "identity",
        "credential",
        "password",
        "otp",
        "device",
        "cyber",
        "account access",
      ]));
  const actionCards: ScamShieldActionCard[] = [];

  if (shouldShowBankAction) {
    actionCards.push({
      id: "bank",
      title: t("dashboard.scamShield.contactYourBank"),
      body: t("dashboard.scamShield.contactYourBankDetailed"),
      secondary: analysis?.summary ?? t("dashboard.scamShield.assetActionIntro"),
      icon: <IconBuildingBank size={17} />,
      iconClassName: "bg-[#fff3df] text-[#ef7d00]",
      href: "/dashboard?view=scamshieldagency",
      cta: t("dashboard.scamShield.callFraudDepartment"),
      agency: "bank",
    });
  }

  if (shouldShowScamwatchAction) {
    actionCards.push({
      id: "accc",
      title: t("dashboard.scamShield.reportToAcccScamwatch"),
      body: t("dashboard.scamShield.reportToAcccDetailed"),
      secondary:
        recommendations[0] ?? t("dashboard.scamShield.communityPreventionBody"),
      badge: t("dashboard.scamShield.communityPrevention"),
      icon: <IconGavel size={17} />,
      iconClassName: "bg-[#fff3df] text-[#ef7d00]",
      href: "/dashboard?view=scamshieldagency",
      cta: t("dashboard.scamShield.launchReportTool"),
      agency: "accc",
    });
  }

  if (shouldShowReportCyberAction) {
    actionCards.push({
      id: "reportCyber",
      title: t("dashboard.scamShield.reportToReportCyber"),
      body: t("dashboard.scamShield.reportToReportCyberBody"),
      secondary:
        recommendations[1] ?? recommendations[0] ?? analysis?.summary ?? "",
      icon: <IconShieldFilled size={14} />,
      iconClassName: "bg-[#fff3df] text-[#ef7d00]",
      href: "/dashboard?view=scamshieldagency",
      cta: t("dashboard.scamShield.launchReportTool"),
      agency: "reportCyber",
    });
  }

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard?view=scamshieldrisk"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.scamShield.nextSteps")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <article className="mt-3 rounded-[16px] border border-[#dce5f1] bg-[#f4f7fc] p-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-4">
          <article className="rounded-[14px] border border-[#e3eaf5] bg-white px-4 py-6 text-center sm:px-6 sm:py-7">
            <h2 className="text-[32px] font-black leading-[1.08] text-[#1f2a3a] sm:text-[42px]">
              {t("dashboard.scamShield.secureAssetsTitle")}
            </h2>
            <p className="mx-auto mt-2 max-w-[560px] text-xs leading-[1.55] text-[#6a7e96] sm:text-sm">
              {analysis?.summary ?? t("dashboard.scamShield.assetActionIntro")}
            </p>
            {recommendations.length ? (
              <div className="mx-auto mt-4 max-w-[760px] rounded-[12px] border border-[#e2eaf4] bg-[#f8fbff] px-4 py-3 text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                  Recommended next steps
                </p>
                <div className="mt-2 space-y-1.5">
                  {recommendations.slice(0, 3).map((recommendation, index) => (
                    <p
                      key={`${recommendation}-${index}`}
                      className="text-[11px] leading-[1.5] text-[#50627a]"
                    >
                      {recommendation}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </article>

          <div className="mt-3 space-y-3">
            {actionCards.map((card) => (
              <article
                key={card.id}
                className="rounded-[12px] border border-[#e2eaf4] bg-white px-3 py-3 sm:px-4 sm:py-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${card.iconClassName}`}
                    >
                      {card.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[25px] font-extrabold leading-none text-[#1f2a3a]">
                          {card.title}
                        </p>
                        {card.badge ? (
                          <span className="inline-flex h-5 items-center rounded-full bg-[#ecf3ff] px-2 text-[8px] font-bold uppercase tracking-[0.08em] text-[#2c66b0]">
                            {card.badge}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-[11px] leading-[1.5] text-[#6a7e96]">
                        {card.body}
                      </p>
                      {card.secondary ? (
                        <p className="mt-1 text-[10px] font-semibold text-[#374b64]">
                          {card.secondary}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <Link
                    href={card.href}
                    onClick={() => {
                      mergeScamShieldFlowState({ selectedAgency: card.agency });
                    }}
                    className="inline-flex h-10 items-center gap-1.5 rounded-[8px] bg-[#ff9800] px-5 text-[11px] font-semibold text-white shadow-[0_8px_16px_rgba(255,152,0,0.26)]"
                  >
                    {card.cta}
                    <IconExternalLink size={12} />
                  </Link>
                </div>
              </article>
            ))}

            {!actionCards.length ? (
              <article className="rounded-[12px] border border-[#e2eaf4] bg-white px-3 py-3 text-[11px] leading-[1.55] text-[#64748b] sm:px-4">
                Run a ScamShield analysis to generate case-specific next steps
                and reporting options for this session.
              </article>
            ) : null}

            {mediaAssets.map((asset) => (
              <article
                key={asset.id}
                className="overflow-hidden rounded-[12px] border border-[#e2eaf4] bg-white"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="h-40 bg-[#edf3fb] sm:h-auto sm:w-[168px] sm:shrink-0">
                    <img
                      src={getMediaAssetImageUrl(asset)}
                      alt={asset.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 px-3 py-3 sm:px-4 sm:py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[25px] font-extrabold leading-none text-[#1f2a3a]">
                        {asset.title}
                      </p>
                      <span className="inline-flex h-5 items-center rounded-full bg-[#ecf3ff] px-2 text-[8px] font-bold uppercase tracking-[0.08em] text-[#2c66b0]">
                        {asset.category}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] font-semibold leading-[1.5] text-[#374b64]">
                      {asset.subtitle}
                    </p>
                    <p className="mt-1 text-[11px] leading-[1.5] text-[#6a7e96]">
                      {asset.bodyText}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

function ScamShieldAgencyPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const flowState = useScamShieldFlowState();
  const [expandedSection, setExpandedSection] = useState<
    "accc" | "reportCyber" | "bank" | null
  >("accc");
  const [privacyConsentEnabled, setPrivacyConsentEnabled] = useState(false);
  const [autoRedactPII, setAutoRedactPII] = useState(true);
  const [redactionMode, setRedactionMode] = useState<"mask" | "labels">(
    "labels"
  );
  const [draftSummary, setDraftSummary] = useState("");
  const [agencyError, setAgencyError] = useState<string | null>(null);
  const [pendingConsentRequirement, setPendingConsentRequirement] =
    useState<ConsentRequirement | null>(null);
  const [isGrantingConsent, setIsGrantingConsent] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const analysisSummary = flowState?.analysis?.summary ?? "";
  const analysisIndicators =
    flowState?.analysis?.indicators ?? flowState?.analysis?.redFlags ?? [];
  const draftReport = flowState?.reportDraft?.draftReport as
    | Record<string, unknown>
    | undefined;
  const destinationDrafts = getRecord(draftReport?.destinations);
  const draftSenderName = getDraftReportValue(
    draftReport,
    "senderName",
    flowState?.analysis ? "Unknown sender" : "Run analysis first"
  );
  const draftScamCategory = getDraftReportValue(
    draftReport,
    "scamCategory",
    analysisIndicators.length
      ? analysisIndicators.slice(0, 2).join(", ")
      : "Pending analysis details"
  );
  const draftPlatform = getDraftReportValue(
    draftReport,
    "platform",
    flowState?.analysis?.type
      ? `${flowState.analysis.type} input`
      : "Pending analysis details"
  );

  useEffect(() => {
    setExpandedSection(flowState?.selectedAgency ?? "accc");
  }, [flowState?.selectedAgency]);

  useEffect(() => {
    setDraftSummary(
      flowState?.reportDraft?.draftReport?.draft ??
        flowState?.reportDraft?.draftReport?.summary ??
        ""
    );
  }, [flowState?.reportDraft]);

  useEffect(() => {
    if (!flowState?.analysis) {
      return;
    }

    let isActive = true;

    void generateScamReportDraft({
      analysisId: flowState.analysis._id ?? "",
      analysisSnapshot: flowState.analysis,
      autoRedactPII,
      redactionMode,
    })
      .then((draft) => {
        if (!isActive) {
          return;
        }

        setDraftSummary(
          draft.draftReport?.draft ??
            draft.draftReport?.summary ??
            (draft.draftReport?.indicators?.length
              ? `Prepared from ScamShield indicators: ${draft.draftReport.indicators.join(", ")}.`
              : analysisSummary)
        );
        mergeScamShieldFlowState({
          reportDraft: draft,
        });
      })
      .catch(() => {
        if (isActive) {
          setDraftSummary(analysisSummary);
        }
      });

    return () => {
      isActive = false;
    };
  }, [analysisSummary, autoRedactPII, flowState?.analysis, redactionMode]);

  const handleSubmitToAgency = async () => {
    if (!flowState?.analysis) {
      setAgencyError(
        "Run a ScamShield analysis before preparing agency submission."
      );
      return;
    }

    if (!privacyConsentEnabled) {
      setAgencyError(
        "Report draft is prepared locally. Turn on sharing consent before sending details to an external service or agency."
      );
      mergeScamShieldFlowState({
        submitted: false,
      });
      return;
    }

    setIsSubmittingReport(true);
    setAgencyError(null);

    try {
      const destination =
        expandedSection === "bank"
          ? "bank"
          : expandedSection === "reportCyber"
            ? "reportCyber"
            : "scamwatch";
      const submittedAnalysis = await submitScamReport({
        analysisId: flowState.analysis._id,
        analysisSnapshot: flowState.analysis,
        destination,
        consentToShare: privacyConsentEnabled,
      });
      mergeScamShieldFlowState({
        analysis: submittedAnalysis,
        submitted: true,
      });
      router.push("/dashboard?view=reportsubmissionreview");
    } catch (error) {
      if (error instanceof ConsentRequiredError) {
        setPendingConsentRequirement(error.requirement);
        return;
      }

      setAgencyError(
        error instanceof Error
          ? error.message
          : "Agency submission could not be prepared."
      );
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="px-2 pt-2 sm:px-4 sm:pt-4">
      <div className="mx-auto flex min-h-[1196px] w-full max-w-[1184px] flex-col pb-8">
        <div className="mx-auto flex h-[61px] w-full max-w-[1184px] items-center justify-between border-b border-[#E2E8F0] bg-[#FFFFFFCC] px-4 sm:px-8 lg:px-[80px]">
          <Link
            href="/dashboard?view=scamshieldassets"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.scamShield.safeSpeakAnalyzer")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <article className="mt-3 rounded-[16px] border border-[#dce5f1] bg-[#f4f7fc] p-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-4">
          <article className="mx-auto w-full max-w-[1136px] rounded-[14px] border border-[#e3eaf5] bg-white px-4 py-5 text-center sm:px-6 sm:py-6">
            <h2
              className={`${interFont.className} mx-auto h-[36px] w-full max-w-[369px] text-[30px] font-extrabold leading-[36px] tracking-[0] text-[#1f2a3a]`}
            >
              {t("dashboard.scamShield.prefilledAgencyReports")}
            </h2>
            <p
              className={`${interFont.className} mx-auto mt-3 w-full max-w-[780px] text-center text-[18px] font-normal leading-[29.25px] tracking-[0] text-[#6b7280]`}
            >
              {t("dashboard.scamShield.prefilledAgencyReportsAnalyzerBody")}
            </p>
            {draftSummary ? (
              <div className="mt-4 rounded-[12px] border border-[#e2eaf5] bg-[#f8fbff] px-4 py-3 text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                  Generated draft
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      downloadTextFile(
                        "scamshield-report-draft.txt",
                        draftSummary
                      )
                    }
                    className="inline-flex h-8 items-center gap-1 rounded-full border border-[#d6e2f0] bg-white px-3 text-[10px] font-semibold text-[#37506d]"
                  >
                    <IconDownload size={12} />
                    Download draft
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void redactScamContent({
                        text: draftSummary,
                        replacement: redactionMode,
                      }).then((result) => {
                        setDraftSummary(result.redactedText);
                      });
                    }}
                    className="inline-flex h-8 items-center gap-1 rounded-full border border-[#d6e2f0] bg-white px-3 text-[10px] font-semibold text-[#37506d]"
                  >
                    <IconShieldFilled size={12} />
                    Redact preview now
                  </button>
                </div>
                <p className="mt-2 text-[11px] leading-[1.6] text-[#50627a]">
                  {draftSummary}
                </p>
                {analysisIndicators.length ? (
                  <p className="mt-2 text-[10px] font-semibold text-[#60728a]">
                    Backend indicators: {analysisIndicators.join(", ")}
                  </p>
                ) : null}
              </div>
            ) : null}
          </article>

          {!flowState?.analysis ? (
            <div className="mt-3 rounded-[12px] border border-[#dbeafe] bg-[#eff6ff] px-3 py-3 text-[11px] leading-[1.55] text-[#1d4f8f]">
              Run a ScamShield analysis before preparing agency fields. This
              page will use the real analysis summary, indicators, and extracted
              details once available.
            </div>
          ) : null}

          {agencyError ? (
            <div className="mt-3 rounded-[12px] border border-[#fde2e2] bg-[#fff5f5] px-3 py-3 text-[11px] text-[#b45353]">
              {agencyError}
            </div>
          ) : null}

          <div className="mt-3 space-y-3">
            <article className="overflow-hidden rounded-[12px] border border-[#e2eaf4] bg-white">
              <button
                type="button"
                onClick={() =>
                  setExpandedSection((currentSection) =>
                    currentSection === "accc" ? null : "accc"
                  )
                }
                className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left sm:px-4 sm:py-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ecf3ff] text-[#2d66b0]">
                    <IconGavel size={14} />
                  </span>
                  <p className="truncate text-[14px] font-bold text-[#1f2a3a] sm:text-[15px]">
                    {t("dashboard.scamShield.reportToAcccScamwatch")}
                  </p>
                </div>
                <IconChevronRight
                  size={14}
                  className={`text-[#8fa0b6] transition-transform ${
                    expandedSection === "accc" ? "rotate-90" : "rotate-0"
                  }`}
                />
              </button>

              {expandedSection === "accc" ? (
                <div className="border-t border-[#e8eff8] px-3 pb-3 pt-2.5 sm:px-4 sm:pb-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8ca0b8]">
                    {t("dashboard.scamShield.prefilledDetails")}
                  </p>

                  <div className="mt-2.5">
                    <label className="text-[10px] font-semibold text-[#60728a]">
                      {t("dashboard.scamShield.senderName")}
                    </label>
                    <div className="relative mt-1">
                      <input
                        readOnly
                        value={draftSenderName}
                        className="h-10 w-full rounded-[8px] border border-[#dce5f1] bg-[#f8fbff] px-3 pr-10 text-[12px] text-[#253447] outline-none"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#16a56a]">
                        <IconShieldFilled size={13} />
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                    <div>
                      <label className="text-[10px] font-semibold text-[#60728a]">
                        {t("dashboard.scamShield.scamCategory")}
                      </label>
                      <div className="relative mt-1">
                        <input
                          readOnly
                          value={draftScamCategory}
                          className="h-10 w-full rounded-[8px] border border-[#dce5f1] bg-[#f8fbff] px-3 pr-9 text-[12px] text-[#253447] outline-none"
                        />
                        <IconChevronRight
                          size={12}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-[#8fa0b6]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-[#60728a]">
                        {t("dashboard.scamShield.platform")}
                      </label>
                      <div className="relative mt-1">
                        <input
                          readOnly
                          value={draftPlatform}
                          className="h-10 w-full rounded-[8px] border border-[#dce5f1] bg-[#f8fbff] px-3 pr-9 text-[12px] text-[#253447] outline-none"
                        />
                        <IconChevronRight
                          size={12}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-[#8fa0b6]"
                        />
                      </div>
                    </div>
                  </div>
                  {getRecord(destinationDrafts?.scamwatch) ? (
                    <div className="mt-3 rounded-[10px] border border-[#dce5f1] bg-[#f8fbff] px-3 py-3">
                      <p className="text-[10px] font-semibold text-[#51657f]">
                        {String(
                          getRecord(destinationDrafts?.scamwatch)?.body ?? ""
                        )}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {getRecord(destinationDrafts?.scamwatch)?.contactPhone ? (
                          <a
                            href={`tel:${String(
                              getRecord(destinationDrafts?.scamwatch)?.contactPhone
                            ).replace(/[^\d+]/g, "")}`}
                            className="inline-flex h-8 items-center gap-1 rounded-full border border-[#d6e2f0] bg-white px-3 text-[10px] font-semibold text-[#37506d]"
                          >
                            <IconBuildingBank size={12} />
                            Call contact
                          </a>
                        ) : null}
                        <button
                          type="button"
                          onClick={() =>
                            downloadTextFile(
                              String(
                                getRecord(destinationDrafts?.scamwatch)
                                  ?.downloadFileName ??
                                  "scamwatch-report-draft.txt"
                              ),
                              draftSummary
                            )
                          }
                          className="inline-flex h-8 items-center gap-1 rounded-full border border-[#d6e2f0] bg-white px-3 text-[10px] font-semibold text-[#37506d]"
                        >
                          <IconDownload size={12} />
                          Download Scamwatch draft
                        </button>
                        <a
                          href={String(
                            getRecord(destinationDrafts?.scamwatch)
                              ?.guidanceUrl ?? "#"
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-8 items-center gap-1 rounded-full border border-[#d6e2f0] bg-white px-3 text-[10px] font-semibold text-[#37506d]"
                        >
                          <IconExternalLink size={12} />
                          Open Scamwatch
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </article>

            <article className="overflow-hidden rounded-[12px] border border-[#e2eaf4] bg-white">
              <button
                type="button"
                onClick={() =>
                  setExpandedSection((currentSection) =>
                    currentSection === "reportCyber" ? null : "reportCyber"
                  )
                }
                className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left sm:px-4 sm:py-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf1ff] text-[#5f6be0]">
                    <IconShieldFilled size={13} />
                  </span>
                  <p className="truncate text-[14px] font-bold text-[#1f2a3a] sm:text-[15px]">
                    {t("dashboard.scamShield.reportCyberAcsc")}
                  </p>
                </div>
                <IconChevronRight
                  size={14}
                  className={`text-[#8fa0b6] transition-transform ${
                    expandedSection === "reportCyber" ? "rotate-90" : "rotate-0"
                  }`}
                />
              </button>

              {expandedSection === "reportCyber" ? (
                <div className="border-t border-[#e8eff8] px-3 py-3 text-[12px] leading-[1.55] text-[#60728a] sm:px-4">
                  <p>{t("dashboard.scamShield.reportCyberPanelBody")}</p>
                  {getRecord(destinationDrafts?.reportCyber) ? (
                    <div className="mt-3 rounded-[10px] border border-[#dce5f1] bg-[#f8fbff] px-3 py-3">
                      <p className="text-[10px] font-semibold text-[#51657f]">
                        {String(
                          getRecord(destinationDrafts?.reportCyber)?.body ?? ""
                        )}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {getRecord(destinationDrafts?.reportCyber)?.contactPhone ? (
                          <a
                            href={`tel:${String(
                              getRecord(destinationDrafts?.reportCyber)?.contactPhone
                            ).replace(/[^\d+]/g, "")}`}
                            className="inline-flex h-8 items-center gap-1 rounded-full border border-[#d6e2f0] bg-white px-3 text-[10px] font-semibold text-[#37506d]"
                          >
                            <IconBuildingBank size={12} />
                            Call contact
                          </a>
                        ) : null}
                        <button
                          type="button"
                          onClick={() =>
                            downloadTextFile(
                              String(
                                getRecord(destinationDrafts?.reportCyber)
                                  ?.downloadFileName ??
                                  "reportcyber-guidance.txt"
                              ),
                              draftSummary
                            )
                          }
                          className="inline-flex h-8 items-center gap-1 rounded-full border border-[#d6e2f0] bg-white px-3 text-[10px] font-semibold text-[#37506d]"
                        >
                          <IconDownload size={12} />
                          Download ReportCyber guide
                        </button>
                        <a
                          href={String(
                            getRecord(destinationDrafts?.reportCyber)
                              ?.guidanceUrl ?? "#"
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-8 items-center gap-1 rounded-full border border-[#d6e2f0] bg-white px-3 text-[10px] font-semibold text-[#37506d]"
                        >
                          <IconExternalLink size={12} />
                          Open ACSC guidance
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </article>

            <article className="overflow-hidden rounded-[12px] border border-[#e2eaf4] bg-white">
              <button
                type="button"
                onClick={() =>
                  setExpandedSection((currentSection) =>
                    currentSection === "bank" ? null : "bank"
                  )
                }
                className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left sm:px-4 sm:py-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e7fbf6] text-[#0f9c7c]">
                    <IconBuildingBank size={14} />
                  </span>
                  <p className="truncate text-[14px] font-bold text-[#1f2a3a] sm:text-[15px]">
                    {t("dashboard.scamShield.bankSecurityDept")}
                  </p>
                </div>
                <IconChevronRight
                  size={14}
                  className={`text-[#8fa0b6] transition-transform ${
                    expandedSection === "bank" ? "rotate-90" : "rotate-0"
                  }`}
                />
              </button>

              {expandedSection === "bank" ? (
                <div className="border-t border-[#e8eff8] px-3 py-3 text-[12px] leading-[1.55] text-[#60728a] sm:px-4">
                  <p>{t("dashboard.scamShield.bankSecurityPanelBody")}</p>
                  {getRecord(destinationDrafts?.bank) ? (
                    <div className="mt-3 rounded-[10px] border border-[#dce5f1] bg-[#f8fbff] px-3 py-3">
                      <p className="text-[10px] font-semibold text-[#51657f]">
                        {String(getRecord(destinationDrafts?.bank)?.body ?? "")}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {getRecord(destinationDrafts?.bank)?.contactPhone ? (
                          <a
                            href={`tel:${String(
                              getRecord(destinationDrafts?.bank)?.contactPhone
                            ).replace(/[^\d+]/g, "")}`}
                            className="inline-flex h-8 items-center gap-1 rounded-full border border-[#d6e2f0] bg-white px-3 text-[10px] font-semibold text-[#37506d]"
                          >
                            <IconBuildingBank size={12} />
                            {`Call ${String(
                              getRecord(destinationDrafts?.bank)?.bankName ??
                                "bank fraud line"
                            )}`}
                          </a>
                        ) : null}
                        <button
                          type="button"
                          onClick={() =>
                            downloadTextFile(
                              String(
                                getRecord(destinationDrafts?.bank)
                                  ?.downloadFileName ??
                                  "bank-fraud-contact-template.txt"
                              ),
                              draftSummary
                            )
                          }
                          className="inline-flex h-8 items-center gap-1 rounded-full border border-[#d6e2f0] bg-white px-3 text-[10px] font-semibold text-[#37506d]"
                        >
                          <IconDownload size={12} />
                          Download bank template
                        </button>
                        <a
                          href={String(
                            getRecord(destinationDrafts?.bank)?.guidanceUrl ??
                              "#"
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-8 items-center gap-1 rounded-full border border-[#d6e2f0] bg-white px-3 text-[10px] font-semibold text-[#37506d]"
                        >
                          <IconExternalLink size={12} />
                          Open bank guidance
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </article>
          </div>

          <article className="mt-3 rounded-[12px] border border-[#e2eaf4] bg-white px-3 py-3 sm:px-4 sm:py-3.5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-[#1f2a3a]">
                  Auto-redact personal details
                </p>
                <p className="mt-1 text-[10px] leading-[1.45] text-[#6a7e96] sm:text-[11px]">
                  Remove emails, phone numbers, amounts, URLs, and transaction
                  identifiers from generated report drafts before download or
                  sharing.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={autoRedactPII}
                onClick={() => setAutoRedactPII((value) => !value)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  autoRedactPII ? "bg-[#ff9800]" : "bg-[#d5dde8]"
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(15,23,42,0.35)] transition-transform ${
                    autoRedactPII ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["labels", "mask"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setRedactionMode(mode)}
                  className={`inline-flex h-8 items-center rounded-full px-3 text-[10px] font-bold ${
                    redactionMode === mode
                      ? "bg-[#0f5d9f] text-white"
                      : "bg-[#f4f7fb] text-[#60728a]"
                  }`}
                >
                  {mode === "labels" ? "Use labels" : "Mask values"}
                </button>
              ))}
            </div>
          </article>

          <article className="mt-3 rounded-[12px] border border-[#e2eaf4] bg-white px-3 py-3 sm:px-4 sm:py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-[#1f2a3a]">
                  {t("dashboard.scamShield.privacyConsent")}
                </p>
                <p className="mt-1 text-[10px] leading-[1.45] text-[#6a7e96] sm:text-[11px]">
                  {t("dashboard.scamShield.privacyConsentBody")}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={privacyConsentEnabled}
                onClick={() =>
                  setPrivacyConsentEnabled((isEnabled) => !isEnabled)
                }
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  privacyConsentEnabled ? "bg-[#ff9800]" : "bg-[#d5dde8]"
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(15,23,42,0.35)] transition-transform ${
                    privacyConsentEnabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </article>

          <Link
            href="#"
            onClick={(event) => {
              event.preventDefault();
              void handleSubmitToAgency();
            }}
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-[#ff9800] px-6 text-[12px] font-bold text-white shadow-[0_8px_18px_rgba(255,152,0,0.34)]"
          >
            <IconArrowRight size={13} />
            {isSubmittingReport
              ? "Submitting..."
              : privacyConsentEnabled
                ? t("dashboard.scamShield.submitAllReports")
                : "Keep draft prepared"}
          </Link>
          <p className="mt-2 text-center text-[8px] font-semibold uppercase tracking-[0.08em] text-[#9aabc0]">
            {t("dashboard.scamShield.encryptedSubmissionNotice")}
          </p>

          {pendingConsentRequirement ? (
            <div className="mt-3">
              <ConsentRequiredCard
                requirement={pendingConsentRequirement}
                isSubmitting={isGrantingConsent}
                onAllow={() => {
                  void (async () => {
                    setIsGrantingConsent(true);

                    try {
                      await grantConsent(
                        { share_with_agencies: true },
                        pendingConsentRequirement.source
                      );
                      setPendingConsentRequirement(null);
                      await handleSubmitToAgency();
                    } catch (error) {
                      setAgencyError(
                        error instanceof Error
                          ? error.message
                          : "Consent could not be saved."
                      );
                    } finally {
                      setIsGrantingConsent(false);
                    }
                  })();
                }}
                onDecline={() => {
                  setPendingConsentRequirement(null);
                }}
              />
            </div>
          ) : null}
        </article>
      </div>
    </div>
  );
}

export {
  ScamShieldAgencyPage,
  ScamShieldAssetsPage,
  ScamShieldIntakePage,
  ScamShieldRiskPage,
};
