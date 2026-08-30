"use client";

import { FormEvent, useRef, useState } from "react";

import { IconAlertCircle, IconLoader2, IconSearch } from "@tabler/icons-react";

import { ConsentRequiredCard } from "@/components/consent/consent-required-card";
import { useConsentGate } from "@/hooks/use-consent-gate";
import {
  answerRagQuestion,
  type RagAnswerCitation,
  type RagAnswerResult,
  type RagJurisdiction,
  type RagSourceCategory,
  type RagTopic,
} from "@/lib/rag-client";

function formatCitationDate(value?: string) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function CitationList({ citations }: { citations: RagAnswerCitation[] }) {
  return (
    <div className="mt-3 border-t border-[#edf2f7] pt-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7d8ea5]">
        Approved source citations
      </p>
      <div className="mt-2 space-y-2">
        {citations.map((citation) => {
          const citationKey =
            citation.sourceId ??
            `${citation.title}-${citation.url ?? ""}-${citation.sectionRef ?? ""}`;
          const details = [
            citation.publisher,
            citation.jurisdiction,
            citation.sourceCategory,
            citation.sourceType,
            citation.topic,
            citation.sectionRef ? `Section ${citation.sectionRef}` : undefined,
            citation.sectionTitle ? `- ${citation.sectionTitle}` : undefined,
            citation.pageStart
              ? `p. ${
                  citation.pageEnd && citation.pageEnd !== citation.pageStart
                    ? `${citation.pageStart}-${citation.pageEnd}`
                    : citation.pageStart
                }`
              : citation.page
                ? `p. ${citation.page}`
                : undefined,
            citation.versionDate
              ? `Version ${formatCitationDate(citation.versionDate)}`
              : undefined,
            citation.commencementDate
              ? `Commenced ${formatCitationDate(citation.commencementDate)}`
              : undefined,
            citation.amendmentStatus &&
            citation.amendmentStatus !== "in_force"
              ? citation.amendmentStatus.replace("_", " ")
              : undefined,
            formatCitationDate(citation.lastUpdated),
          ].filter(Boolean);

          return (
            <article
              key={citationKey}
              className="rounded-[12px] border border-[#e1eaf4] bg-[#fbfdff] px-3 py-2"
            >
              {citation.url ? (
                <a
                  href={citation.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-[#2f6fca] underline-offset-2 hover:underline"
                >
                  {citation.title}
                </a>
              ) : (
                <p className="text-[11px] font-bold text-[#1f2a3a]">
                  {citation.title}
                </p>
              )}
              {details.length ? (
                <p className="mt-1 text-[9px] leading-[1.45] text-[#7d8ea5]">
                  {details.join(" | ")}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function SourceBackedQaPanel({
  title = "Source-backed Q&A",
  description = "Ask a question and SafeSpeak will answer only from approved knowledge sources when citations are available.",
  defaultQuestion = "",
  language = "en",
  jurisdiction,
  sourceCategory,
  topic,
  className = "",
}: {
  title?: string;
  description?: string;
  defaultQuestion?: string;
  language?: string;
  jurisdiction?: RagJurisdiction;
  sourceCategory?: RagSourceCategory;
  topic?: RagTopic;
  className?: string;
}) {
  const [question, setQuestion] = useState(defaultQuestion);
  const [answer, setAnswer] = useState<RagAnswerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const pendingQuestionRef = useRef<string | null>(null);
  const {
    pendingConsentRequirement,
    isGrantingConsent,
    captureConsentError,
    clearPendingConsent,
    grantPendingConsent,
  } = useConsentGate();

  const askQuestion = async (nextQuestion: string) => {
    const trimmedQuestion = nextQuestion.trim();

    if (!trimmedQuestion) {
      setError("Enter a question before asking SafeSpeak.");
      return;
    }

    setIsAsking(true);
    setError(null);

    try {
      const response = await answerRagQuestion({
        question: trimmedQuestion,
        query: trimmedQuestion,
        topK: 5,
        language,
        jurisdiction,
        sourceCategory,
        topic,
      });

      pendingQuestionRef.current = null;
      setAnswer(response);
    } catch (requestError) {
      if (captureConsentError(requestError)) {
        pendingQuestionRef.current = trimmedQuestion;
        return;
      }

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Source-backed answer failed."
      );
    } finally {
      setIsAsking(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void askQuestion(question);
  };

  const handleAllowConsent = async () => {
    try {
      await grantPendingConsent();
      const pendingQuestion = pendingQuestionRef.current;

      if (pendingQuestion) {
        void askQuestion(pendingQuestion);
      }
    } catch (consentError) {
      setError(
        consentError instanceof Error
          ? consentError.message
          : "Consent could not be saved."
      );
    }
  };

  const citations = answer?.citations ?? [];
  const hasCitations = citations.length > 0;

  return (
    <section
      className={`rounded-[16px] border border-[#dce6f2] bg-white p-4 ${className}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#3f7de0]">
            {title}
          </p>
          <p className="mt-1 text-[11px] leading-[1.55] text-[#60728a]">
            {description}
          </p>
        </div>
        {answer?.confidence ? (
          <span className="inline-flex h-7 items-center rounded-full bg-[#eef6ff] px-3 text-[10px] font-semibold text-[#3f7de0]">
            Confidence: {answer.confidence}
          </span>
        ) : null}
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

      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about options, support pathways, evidence, or SafeSpeak policy"
          className="h-10 min-w-0 flex-1 rounded-[10px] border border-[#d7e1ee] bg-[#f8fbff] px-3 text-[12px] text-[#1f2a3a] outline-none placeholder:text-[#95a3b8]"
        />
        <button
          type="submit"
          disabled={isAsking || !question.trim()}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[10px] bg-[#0f5d9f] px-4 text-[11px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAsking ? (
            <IconLoader2 size={14} className="animate-spin" />
          ) : (
            <IconSearch size={14} />
          )}
          Ask
        </button>
      </form>

      {error ? (
        <div className="mt-3 rounded-[12px] border border-[#fde2e2] bg-[#fff5f5] px-3 py-2 text-[11px] text-[#b45353]">
          <span className="inline-flex items-center gap-1.5">
            <IconAlertCircle size={12} />
            {error}
          </span>
        </div>
      ) : null}

      {answer ? (
        <div className="mt-3 rounded-[12px] border border-[#e3ebf4] bg-[#fbfdff] p-3">
          <p className="text-[12px] leading-[1.65] text-[#253447]">
            {answer.answer ||
              "SafeSpeak could not generate an answer from approved sources."}
          </p>
          {answer.disclaimer ? (
            <p className="mt-2 text-[10px] leading-[1.55] text-[#7c8da3]">
              {answer.disclaimer}
            </p>
          ) : null}
          {answer.pendingHumanReview ? (
            <p className="mt-2 text-[10px] font-semibold text-[#9a5b12]">
              Human review recommended before relying on this answer.
            </p>
          ) : null}
          {hasCitations ? (
            <CitationList citations={citations} />
          ) : (
            <p className="mt-3 rounded-[10px] border border-[#f2d8b0] bg-[#fffaf2] px-3 py-2 text-[10px] leading-[1.55] text-[#9a5b12]">
              No approved citations were returned, so this answer is a fallback
              and should not be treated as a cited legal conclusion.
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
