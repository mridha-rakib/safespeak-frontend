"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import {
  IconBoltFilled,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconFileText,
  IconFileTypePdf,
  IconFolderFilled,
  IconPhoto,
  IconMicrophone,
  IconPlayerPlayFilled,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type EvidenceKind = "image" | "video" | "audio" | "document";

type EvidenceItem = {
  id: string;
  name: string;
  sizeLabel: string;
  kind: EvidenceKind;
  status: "attached" | "restored";
};

const DRAFT_STORAGE_KEY = "safespeak_report_evidence_draft";

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function inferEvidenceKind(file: File): EvidenceKind {
  if (file.type.startsWith("image/")) {
    return "image";
  }

  if (file.type.startsWith("video/")) {
    return "video";
  }

  if (file.type.startsWith("audio/")) {
    return "audio";
  }

  return "document";
}

function EvidenceCard({
  item,
  onRemove,
}: {
  item: EvidenceItem;
  onRemove: (id: string) => void;
}) {
  const icon =
    item.kind === "image" ? (
      <IconPhoto size={16} />
    ) : item.kind === "video" ? (
      <IconPlayerPlayFilled size={16} />
    ) : item.kind === "audio" ? (
      <IconMicrophone size={16} />
    ) : item.name.toLowerCase().endsWith(".pdf") ? (
      <IconFileTypePdf size={16} />
    ) : (
      <IconFileText size={16} />
    );

  const accent =
    item.kind === "audio"
      ? "bg-[#fff1e4] text-[#ff8f00]"
      : item.kind === "video"
        ? "bg-[#eef3ff] text-[#335fd6]"
        : item.kind === "image"
          ? "bg-[#eafbf1] text-[#1a8b52]"
          : "bg-[#f3f4f6] text-[#56637a]";

  return (
    <article className="relative rounded-[16px] border border-[#dde7f2] bg-white p-4">
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[#a7b4c6]"
        aria-label={`Remove ${item.name}`}
      >
        <IconX size={12} />
      </button>
      <div className="flex min-h-[132px] items-start gap-3">
        <span
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            accent
          )}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="truncate pr-4 text-[11px] font-semibold text-[#1f2a3a]">
            {item.name}
          </p>
          <p className="mt-1 text-[10px] text-[#8ea0b8]">{item.sizeLabel}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex h-5 items-center rounded-full bg-[#f5f8fc] px-2.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#66788d]">
              {item.kind}
            </span>
            <span
              className={cn(
                "inline-flex h-5 items-center rounded-full px-2.5 text-[9px] font-bold uppercase tracking-[0.08em]",
                item.status === "restored"
                  ? "bg-[#fff1e4] text-[#d97706]"
                  : "bg-[#e8f7ee] text-[#15803d]"
              )}
            >
              {item.status === "restored" ? "Re-upload needed" : "Attached"}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function ReportSubmissionEvidencePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const [description, setDescription] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<EvidenceItem[]>([]);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [restoredDraftNotice, setRestoredDraftNotice] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);

    if (!savedDraft) {
      return;
    }

    try {
      const parsed = JSON.parse(savedDraft) as {
        description?: string;
        supportMessage?: string;
        attachments?: Array<Pick<EvidenceItem, "name" | "sizeLabel" | "kind">>;
        savedAt?: string;
      };

      setDescription(parsed.description ?? "");
      setSupportMessage(parsed.supportMessage ?? "");
      setDraftSavedAt(
        parsed.savedAt
          ? new Date(parsed.savedAt).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })
          : null
      );

      if (parsed.attachments?.length) {
        setAttachedFiles(
          parsed.attachments.map((item, index) => ({
            id: `restored-${index}-${item.name}`,
            name: item.name,
            sizeLabel: item.sizeLabel,
            kind: item.kind,
            status: "restored",
          }))
        );
        setRestoredDraftNotice(
          "Draft text was restored. Re-upload any evidence files before continuing."
        );
      }
    } catch {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }, []);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    const nextItems = Array.from(files).map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      sizeLabel: formatFileSize(file.size),
      kind: inferEvidenceKind(file),
      status: "attached" as const,
    }));

    setAttachedFiles((currentItems) => [...currentItems, ...nextItems]);
  };

  const removeAttachment = (id: string) => {
    setAttachedFiles((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  const saveDraft = () => {
    if (typeof window === "undefined") {
      return;
    }

    const savedAt = new Date();
    window.localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({
        description,
        supportMessage,
        attachments: attachedFiles.map(({ name, sizeLabel, kind }) => ({
          name,
          sizeLabel,
          kind,
        })),
        savedAt: savedAt.toISOString(),
      })
    );

    setDraftSavedAt(
      savedAt.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    );
    setRestoredDraftNotice(null);
  };

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto flex w-full max-w-[1184px] flex-col">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard?view=reportsubmissionrecommendations"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            Attachments
          </Link>
          <Link
            href="/dashboard?view=reportsubmissionhistory"
            aria-label="View report history"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#9ba8bb] transition hover:text-[#74879e]"
          >
            <IconClock size={12} />
          </Link>
        </div>

        <article className="mt-3 rounded-[24px] border border-[#dce5f1] bg-[#f7fafe] px-4 pb-5 pt-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:px-5 sm:pb-6 sm:pt-5 lg:min-h-[1262px] lg:px-6 lg:pb-6 lg:pt-6">
          <article className="rounded-[20px] border border-[#e4ebf4] bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1f2a3a]">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#fff1e4] text-[#ff9a1f]">
                  <IconBoltFilled size={11} />
                </span>
                Incident Description
              </p>
              <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#9aa9bc]">
                Required
              </span>
            </div>

            <div className="mt-3 rounded-[12px] border border-[#e2e9f4] bg-[#f9fbff] p-3">
              <textarea
                rows={5}
                placeholder="Describe the incident details thoroughly. Include time, location, and involved parties..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-[102px] w-full resize-none bg-transparent text-[11px] leading-[1.5] text-[#2a3a4f] outline-none placeholder:text-[#a0afc2]"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] text-[#8ea0b8]">
                  {description.length} characters
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#dee6f2] bg-white px-3 text-[10px] font-semibold text-[#5f7189]"
                  >
                    <IconMicrophone size={11} />
                    Attach voice note
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#dee6f2] bg-white px-3 text-[10px] font-semibold text-[#5f7189]"
                  >
                    <IconFolderFilled size={11} />
                    Upload files
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex h-6 items-center rounded-full bg-[#eef3ff] px-2.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#335fd6]">
                  Text narrative
                </span>
                <span className="inline-flex h-6 items-center rounded-full bg-[#fff1e4] px-2.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#d97706]">
                  <IconMicrophone size={11} />
                  Audio note
                </span>
                <span className="inline-flex h-6 items-center rounded-full bg-[#eafbf1] px-2.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#1a8b52]">
                  <IconPhoto size={11} />
                  Image, video, or PDF
                </span>
              </div>
            </div>
          </article>

          <div className="mt-5 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#1f2a3a]">
                Attached Files
              </h3>
              <p className="mt-0.5 text-[10px] text-[#8ea0b8]">
                Upload evidence to support your report.
              </p>
            </div>
            <span className="inline-flex h-5 items-center rounded-full bg-[#fff2e6] px-2.5 text-[9px] font-bold text-[#ff8f00]">
              {attachedFiles.length} file{attachedFiles.length === 1 ? "" : "s"}{" "}
              attached
            </span>
          </div>

          {restoredDraftNotice ? (
            <div className="mt-3 rounded-[12px] border border-[#ffd6a8] bg-[#fff7ed] px-4 py-3 text-[11px] leading-5 text-[#9a5b12]">
              {restoredDraftNotice}
            </div>
          ) : null}

          <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {attachedFiles.map((item) => (
              <EvidenceCard key={item.id} item={item} onRemove={removeAttachment} />
            ))}

            {attachedFiles.length === 0 ? (
              <article className="rounded-[16px] border border-dashed border-[#d5deea] bg-white p-4 lg:col-span-3">
                <div className="grid min-h-[176px] place-items-center text-center">
                  <div>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1e4] text-[#ff8f00]">
                      <IconFolderFilled size={16} />
                    </span>
                    <p className="mt-3 text-[11px] font-semibold text-[#334155]">
                      No evidence attached yet
                    </p>
                    <p className="mt-1 max-w-[320px] text-[10px] leading-5 text-[#8ea0b8]">
                      Add screenshots, documents, voice notes, videos, or photos
                      when it feels safe to do so.
                    </p>
                  </div>
                </div>
              </article>
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className="rounded-[16px] border border-dashed border-[#ffbf7d] bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#d97706]">
                Voice Note
              </p>
              <p className="mt-2 text-[11px] leading-5 text-[#6d7f96]">
                Attach an audio recording if speaking feels easier than typing.
                On supported mobile devices this can open the recorder directly.
              </p>
              <button
                type="button"
                onClick={() => audioInputRef.current?.click()}
                className="mt-4 inline-flex h-9 items-center justify-center rounded-full bg-[#ff8f00] px-5 text-[11px] font-bold text-white shadow-[0_8px_18px_rgba(255,143,0,0.32)]"
              >
                Record or upload audio
              </button>
            </article>

            <article
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
              }}
              onDrop={(event) => {
                event.preventDefault();
                handleFilesSelected(event.dataTransfer.files);
              }}
              className="grid min-h-[176px] cursor-pointer place-items-center rounded-[16px] border border-dashed border-[#ced9e8] bg-[#fbfcff] p-4 text-center"
            >
              <div>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#fff1e4] text-[#ff8f00]">
                  <IconFolderFilled size={13} />
                </span>
                <p className="mt-2 text-[10px] font-semibold text-[#334155]">
                  Drag, drop, or click to upload
                </p>
                <p className="mt-1 text-[9px] text-[#8ea0b8]">
                  Support for images, video, audio, and PDF documents.
                </p>
              </div>
            </article>
          </div>

          <div className="mt-4 flex h-[58px] items-center gap-2 rounded-[16px] border border-[#dfe7f2] bg-white px-4">
            <input
              type="text"
              placeholder="Type a message to support..."
              value={supportMessage}
              onChange={(event) => setSupportMessage(event.target.value)}
              className="flex-1 bg-transparent text-[11px] text-[#2a3a4f] outline-none placeholder:text-[#a0afc2]"
            />
            <button className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#8ea0b8]">
              <IconMicrophone size={12} />
            </button>
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ff8f00] text-white shadow-[0_6px_14px_rgba(255,143,0,0.35)]">
              <IconChevronRight size={14} />
            </button>
          </div>

          <div className="mt-4 rounded-[12px] border border-[#dfe7f2] bg-white px-4 py-3 sm:px-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <button
                  type="button"
                  onClick={saveDraft}
                  className="inline-flex h-9 items-center justify-center rounded-full px-5 text-[11px] font-semibold text-[#6d7f96]"
                >
                Save as Draft
                </button>
                {draftSavedAt ? (
                  <span className="text-[10px] text-[#8ea0b8]">
                    Draft saved at {draftSavedAt}
                  </span>
                ) : null}
              </div>
              <Link
                href="/dashboard?view=reportsubmissionreview"
                className="inline-flex h-10 min-w-[168px] items-center justify-center rounded-full bg-[#ff8f00] px-8 text-[11px] font-bold text-white shadow-[0_8px_18px_rgba(255,143,0,0.32)]"
              >
                Continue
              </Link>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={(event) => {
              handleFilesSelected(event.target.files);
              event.target.value = "";
            }}
          />
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            capture="user"
            className="hidden"
            onChange={(event) => {
              handleFilesSelected(event.target.files);
              event.target.value = "";
            }}
          />
        </article>
      </div>
    </div>
  );
}

export { ReportSubmissionEvidencePage };
