"use client";

import { useMemo, useRef, useState } from "react";

import {
  IconAlertCircle,
  IconClipboardCheck,
  IconLanguage,
  IconLoader2,
  IconSparkles,
} from "@tabler/icons-react";

import { ConsentRequiredCard } from "@/components/consent/consent-required-card";
import { useConsentGate } from "@/hooks/use-consent-gate";
import type { AssistantIncidentCategory } from "@/lib/assistant-categories";
import {
  extractIncidentFields,
  generateClarifyingQuestions,
  generateSummary,
  redactPii,
  translateText,
  triageReport,
  type AiCitation,
  type AiInteractionResult,
  type ClarifyingQuestionsOutput,
  type ExtractIncidentFieldsOutput,
  type GenerateSummaryOutput,
  type RedactPiiOutput,
  type TranslateOutput,
  type TriageReportResult,
} from "@/lib/ai-client";

type HelperAction =
  | "extract"
  | "clarify"
  | "summary"
  | "triage"
  | "translate"
  | "redact";

type HelperResult =
  | {
      action: "extract";
      result: AiInteractionResult<ExtractIncidentFieldsOutput>;
    }
  | {
      action: "clarify";
      result: AiInteractionResult<ClarifyingQuestionsOutput>;
    }
  | {
      action: "summary";
      result: AiInteractionResult<GenerateSummaryOutput>;
    }
  | {
      action: "triage";
      result: TriageReportResult;
    }
  | {
      action: "translate";
      result: AiInteractionResult<TranslateOutput>;
    }
  | {
      action: "redact";
      result: AiInteractionResult<RedactPiiOutput>;
    };

type DraftField = "who" | "what" | "when" | "where" | "how";

const helperActions: Array<{
  id: HelperAction;
  label: string;
  description: string;
}> = [
  {
    id: "extract",
    label: "Extract fields",
    description: "Preview who, what, when, where, and risk fields.",
  },
  {
    id: "clarify",
    label: "Clarifying questions",
    description: "Generate questions to fill gaps before review.",
  },
  {
    id: "summary",
    label: "Generate summary",
    description: "Draft an information-only summary for review.",
  },
  {
    id: "triage",
    label: "Triage preview",
    description: "Preview support needs and recommended next steps.",
  },
  {
    id: "translate",
    label: "Translate",
    description: "Translate the summary while preserving tone.",
  },
  {
    id: "redact",
    label: "Redact PII",
    description: "Create a redacted version of the summary.",
  },
];

const draftFields: Array<{ key: DraftField; label: string }> = [
  { key: "who", label: "Who" },
  { key: "what", label: "What" },
  { key: "when", label: "When" },
  { key: "where", label: "Where" },
  { key: "how", label: "How" },
];

function listToText(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join("\n");
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
}

function compactText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(", ");
  }

  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function outputOf<TOutput extends object>(
  result: AiInteractionResult<TOutput>
): TOutput {
  return result.output ?? ({} as TOutput);
}

function citationsOf(result: HelperResult): AiCitation[] {
  if (result.action === "triage") {
    return result.result.citations ?? [];
  }

  return result.result.citations ?? [];
}

function reviewStatusOf(result: HelperResult): string | undefined {
  if (result.action === "triage") {
    return result.result.reviewStatus;
  }

  return result.result.reviewStatus ?? outputOf(result.result).reviewStatus;
}

function buildTextPreview(result: HelperResult): string {
  if (result.action === "extract") {
    const output = outputOf(result.result);

    return [
      output.risks ? `Risks: ${listToText(output.risks)}` : "",
      output.evidenceMentioned
        ? `Evidence mentioned: ${listToText(output.evidenceMentioned)}`
        : "",
      output.missingInformation
        ? `Missing information: ${listToText(output.missingInformation)}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (result.action === "clarify") {
    const output = outputOf(result.result);

    return [
      ...(output.questions ?? []),
      output.rationale ? `Rationale: ${output.rationale}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (result.action === "summary") {
    const output = outputOf(result.result);

    return [
      output.summary,
      output.keyFacts?.length ? `Key facts:\n${output.keyFacts.join("\n")}` : "",
      output.uncertaintyNotes?.length
        ? `Uncertainty:\n${output.uncertaintyNotes.join("\n")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (result.action === "triage") {
    return [
      result.result.summary,
      result.result.assessmentBody,
      result.result.recommendedActions?.length
        ? `Recommended actions:\n${result.result.recommendedActions.join("\n")}`
        : "",
      result.result.nonLegalSafetyNotes?.length
        ? `Safety notes:\n${result.result.nonLegalSafetyNotes.join("\n")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (result.action === "translate") {
    return outputOf(result.result).translatedText ?? "";
  }

  return outputOf(result.result).redactedText ?? "";
}

function buildExtractFields(
  result: AiInteractionResult<ExtractIncidentFieldsOutput>
): Record<DraftField, string> {
  const output = outputOf(result);

  return {
    who: compactText(output.who),
    what: compactText(output.what),
    when: compactText(output.when),
    where: compactText(output.where),
    how: compactText(output.how),
  };
}

export function ReportAiHelperPanel({
  reportId,
  summary,
  structuredFields,
  incidentCategory,
  language = "en",
  jurisdiction = "NSW",
  onApplySummary,
  onApplyFields,
}: {
  reportId?: string;
  summary: string;
  structuredFields: Record<string, unknown>;
  incidentCategory?: AssistantIncidentCategory;
  language?: string;
  jurisdiction?: string;
  onApplySummary: (value: string) => void;
  onApplyFields: (fields: Record<string, unknown>) => void;
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [activeAction, setActiveAction] = useState<HelperAction | null>(null);
  const [result, setResult] = useState<HelperResult | null>(null);
  const [editableText, setEditableText] = useState("");
  const [editableFields, setEditableFields] = useState<Record<DraftField, string>>({
    who: "",
    what: "",
    when: "",
    where: "",
    how: "",
  });
  const [error, setError] = useState<string | null>(null);
  const pendingActionRef = useRef<HelperAction | null>(null);
  const {
    pendingConsentRequirement,
    isGrantingConsent,
    captureConsentError,
    clearPendingConsent,
    grantPendingConsent,
  } = useConsentGate();

  const canApplyText = useMemo(
    () =>
      result?.action === "summary" ||
      result?.action === "translate" ||
      result?.action === "redact",
    [result?.action]
  );

  const runHelper = async (action: HelperAction) => {
    const narrative = summary.trim();

    if (!narrative) {
      setError("Add report details before running AI helpers.");
      return;
    }

    setActiveAction(action);
    setIsRunning(true);
    setError(null);

    try {
      let nextResult: HelperResult;

      if (action === "extract") {
        const helperResult = await extractIncidentFields({
          reportId,
          language,
          incidentCategory,
          narrative,
          jurisdiction,
        });

        nextResult = { action, result: helperResult };
        setEditableFields(buildExtractFields(helperResult));
      } else if (action === "clarify") {
        nextResult = {
          action,
          result: await generateClarifyingQuestions({
            reportId,
            language,
            incidentCategory,
            narrative,
            structuredFields,
            maxQuestions: 5,
          }),
        };
      } else if (action === "summary") {
        nextResult = {
          action,
          result: await generateSummary({
            reportId,
            language,
            incidentCategory,
            narrative,
            structuredFields,
            audience: "user",
          }),
        };
      } else if (action === "triage") {
        nextResult = {
          action,
          result: await triageReport({
            reportId,
            language,
            incidentCategory,
            narrative,
            structuredFields,
          }),
        };
      } else if (action === "translate") {
        nextResult = {
          action,
          result: await translateText({
            text: narrative,
            sourceLanguage: "auto",
            targetLanguage: "English",
          }),
        };
      } else {
        nextResult = {
          action,
          result: await redactPii({
            text: narrative,
            language,
            replacementStyle: "labels",
          }),
        };
      }

      pendingActionRef.current = null;
      setResult(nextResult);
      setEditableText(buildTextPreview(nextResult));
    } catch (helperError) {
      if (captureConsentError(helperError)) {
        pendingActionRef.current = action;
        return;
      }

      setError(
        helperError instanceof Error
          ? helperError.message
          : "AI helper could not run."
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleAllowConsent = async () => {
    try {
      await grantPendingConsent();
      const pendingAction = pendingActionRef.current;

      if (pendingAction) {
        void runHelper(pendingAction);
      }
    } catch (consentError) {
      setError(
        consentError instanceof Error
          ? consentError.message
          : "Consent could not be saved."
      );
    }
  };

  const applyExtractedFields = () => {
    onApplyFields({
      ...structuredFields,
      ...editableFields,
      what: editableFields.what || structuredFields.what,
      when: editableFields.when || structuredFields.when,
      where: editableFields.where || structuredFields.where,
    });

    if (editableFields.what) {
      onApplySummary(editableFields.what);
    }
  };

  const applyTextPreview = () => {
    const reviewedText = editableText.trim();

    if (reviewedText) {
      onApplySummary(reviewedText);
    }
  };

  const citations = result ? citationsOf(result) : [];
  const reviewStatus = result ? reviewStatusOf(result) : undefined;

  return (
    <section className="rounded-[16px] border border-[#dce6f2] bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#3f7de0]">
            AI report helpers
          </p>
          <p className="mt-1 text-[11px] leading-[1.55] text-[#60728a]">
            AI output is information-only. Review and edit every suggestion
            before applying it to the draft.
          </p>
        </div>
        <span className="inline-flex h-7 items-center rounded-full bg-[#fff7ed] px-3 text-[10px] font-semibold text-[#b45309]">
          Human review required
        </span>
      </div>

      {pendingConsentRequirement ? (
        <div className="mt-3">
          <ConsentRequiredCard
            requirement={pendingConsentRequirement}
            isSubmitting={isGrantingConsent}
            onAllow={() => {
              void handleAllowConsent();
            }}
            onDecline={clearPendingConsent}
          />
        </div>
      ) : null}

      {error ? (
        <div className="mt-3 rounded-[12px] border border-[#fde2e2] bg-[#fff5f5] px-3 py-2 text-[11px] text-[#b45353]">
          <span className="inline-flex items-center gap-1.5">
            <IconAlertCircle size={12} />
            {error}
          </span>
        </div>
      ) : null}

      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {helperActions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => {
              void runHelper(action.id);
            }}
            disabled={isRunning}
            className={`rounded-[12px] border px-3 py-2 text-left transition ${
              activeAction === action.id
                ? "border-[#0f5d9f] bg-[#f7fbff]"
                : "border-[#dce6f2] bg-[#fbfdff] hover:border-[#c5d8ec]"
            } ${isRunning ? "cursor-wait opacity-70" : ""}`}
          >
            <span className="flex items-center gap-2 text-[11px] font-bold text-[#1f2a3a]">
              {isRunning && activeAction === action.id ? (
                <IconLoader2 size={13} className="animate-spin text-[#0f5d9f]" />
              ) : action.id === "translate" ? (
                <IconLanguage size={13} className="text-[#0f5d9f]" />
              ) : (
                <IconSparkles size={13} className="text-[#0f5d9f]" />
              )}
              {action.label}
            </span>
            <span className="mt-1 block text-[10px] leading-[1.45] text-[#6b7d94]">
              {action.description}
            </span>
          </button>
        ))}
      </div>

      {result ? (
        <div className="mt-4 rounded-[14px] border border-[#e1eaf4] bg-[#fbfdff] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7d8ea5]">
              Reviewed preview
            </p>
            {reviewStatus ? (
              <span className="rounded-full bg-[#fff7ed] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#b45309]">
                {reviewStatus.replace(/_/g, " ")}
              </span>
            ) : null}
          </div>

          {result.action === "extract" ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {draftFields.map((field) => (
                <label key={field.key} className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-[#7f90a6]">
                    {field.label}
                  </span>
                  <input
                    value={editableFields[field.key]}
                    onChange={(event) =>
                      setEditableFields((currentFields) => ({
                        ...currentFields,
                        [field.key]: event.target.value,
                      }))
                    }
                    className="h-9 rounded-[8px] border border-[#dce5f1] bg-white px-3 text-[12px] text-[#1f2a3a] outline-none"
                  />
                </label>
              ))}
              <div className="sm:col-span-2">
                <textarea
                  value={editableText}
                  onChange={(event) => setEditableText(event.target.value)}
                  rows={5}
                  className="w-full resize-none rounded-[10px] border border-[#dce5f1] bg-white px-3 py-2 text-[11px] leading-[1.55] text-[#253447] outline-none"
                  placeholder="Risks, evidence, and missing information"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={applyExtractedFields}
                  className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-[#0f5d9f] px-4 text-[10px] font-bold text-white"
                >
                  <IconClipboardCheck size={12} />
                  Apply reviewed fields
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <textarea
                value={editableText}
                onChange={(event) => setEditableText(event.target.value)}
                rows={8}
                className="w-full resize-none rounded-[10px] border border-[#dce5f1] bg-white px-3 py-2 text-[11px] leading-[1.6] text-[#253447] outline-none"
              />
              {canApplyText ? (
                <button
                  type="button"
                  onClick={applyTextPreview}
                  className="mt-2 inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-[#0f5d9f] px-4 text-[10px] font-bold text-white"
                >
                  <IconClipboardCheck size={12} />
                  Use reviewed text as summary
                </button>
              ) : null}
            </div>
          )}

          {result.action === "triage" && result.result.disclaimer ? (
            <p className="mt-3 text-[10px] leading-[1.55] text-[#7c8da3]">
              {result.result.disclaimer}
            </p>
          ) : null}

          {citations.length ? (
            <div className="mt-3 rounded-[10px] border border-[#edf2f8] bg-white px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7d8ea5]">
                Source trace
              </p>
              <div className="mt-1 space-y-1">
                {citations.map((citation, index) => (
                  <p
                    key={`${citation.sourceType ?? "source"}-${citation.sourceId ?? index}`}
                    className="text-[10px] leading-[1.5] text-[#60728a]"
                  >
                    <span className="font-semibold text-[#1f2a3a]">
                      {citation.title ?? citation.sourceType ?? "Source"}
                    </span>
                    {citation.excerpt ? ` - ${citation.excerpt}` : null}
                  </p>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
