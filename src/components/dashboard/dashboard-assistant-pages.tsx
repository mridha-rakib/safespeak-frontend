"use client";

import Image from "next/image";
import Link from "next/link";

import { IconChevronLeft, IconMicrophone } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import sendIcon from "@/assets/sendIcon.svg?url";
import { AssistantInteraction } from "@/components/dashboard/assistant-interaction";

import { interFont } from "./dashboard-shared";

function SafeSpeakAssistantPage({
  isRecording = false,
}: {
  isRecording?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto flex w-full max-w-[1184px] flex-col">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.assistant.timelineBuilder")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <AssistantInteraction
          isRecording={isRecording}
          headlineClassName={`${interFont.className} mt-[40px] max-w-[510px] text-center text-[36px] font-semibold leading-[40px] tracking-[0] text-[#24364f]`}
        />
      </div>
    </div>
  );
}

function SafeSpeakAssistantConversationPage({
  initialMessage,
}: {
  initialMessage?: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto flex w-full max-w-[1184px] flex-col">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard?view=assistant"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.assistant.timelineBuilder")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <div className="mt-2 grid min-h-[730px] grid-cols-1 gap-2 xl:grid-cols-[1.65fr_1fr]">
          <div className="rounded-[14px] bg-[#dff0fb] p-3">
            <div className="space-y-3">
              <div>
                <div className="inline-flex max-w-[420px] rounded-2xl bg-white px-3 py-2 text-[10px] text-[#5f6f86]">
                  {t("dashboard.assistant.conversation.botPromptWho")}
                </div>
                <p className="mt-1 text-[9px] text-[#9aa7b8]">9:41 AM</p>
              </div>

              <div className="flex justify-end">
                <div className="max-w-[360px] rounded-2xl bg-white px-3 py-2 text-[10px] text-[#3d4a5f]">
                  {initialMessage?.trim() ||
                    t("dashboard.assistant.conversation.defaultUserReply")}
                </div>
              </div>

              <div>
                <div className="inline-flex max-w-[420px] rounded-2xl bg-white px-3 py-2 text-[10px] text-[#5f6f86]">
                  {t("dashboard.assistant.conversation.botPromptWhere")}
                </div>
                <p className="mt-1 text-[9px] text-[#9aa7b8]">9:42 AM</p>
              </div>
            </div>

            <div className="mt-6 rounded-[16px] border border-[#dbe6f2] bg-white p-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t("dashboard.assistant.typeYourResponse")}
                  className="h-9 flex-1 rounded-full bg-[#f6f9fc] px-4 text-xs text-[#1f2937] outline-none placeholder:text-[#95a3b8]"
                />
                <button
                  aria-label={t("dashboard.assistant.toggleMicrophone")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#8b97a8]"
                >
                  <IconMicrophone size={14} />
                </button>
                <button
                  aria-label={t("common.send")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f59e0b] text-white"
                >
                  <Image
                    src={sendIcon}
                    alt={t("common.send")}
                    width={10}
                    height={14}
                    className="h-[14px] w-[10px]"
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] border border-[#e3e9f2] bg-white p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#5f6f86]">
                {t("dashboard.assistant.conversation.liveTimelineBuilder")}
              </p>
              <span className="rounded-full bg-[#eaf2ff] px-2 py-0.5 text-[8px] font-semibold text-[#3f7de0]">
                {t("dashboard.assistant.conversation.updating")}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="rounded-[10px] border border-[#ebeff5] bg-[#f9fbfd] p-2.5">
                <p className="text-[8px] font-semibold uppercase text-[#8fa0b6]">
                  {t("dashboard.assistant.conversation.who")}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-[#1f2a3a]">
                  {t("dashboard.assistant.conversation.whoValue")}
                </p>
                <div className="mt-2 h-[2px] rounded-full bg-[#d8e3f5]">
                  <div className="h-[2px] w-[68%] rounded-full bg-[#3f7de0]" />
                </div>
              </div>

              <div className="rounded-[10px] border border-[#ebeff5] bg-[#f9fbfd] p-2.5">
                <p className="text-[8px] font-semibold uppercase text-[#8fa0b6]">
                  {t("dashboard.assistant.conversation.what")}
                </p>
                <p className="mt-1 text-[11px] italic text-[#8fa0b6]">
                  {t("dashboard.assistant.conversation.waitingForDetails")}
                </p>
              </div>

              <div className="rounded-[10px] border border-[#ebeff5] bg-[#f9fbfd] p-2.5">
                <p className="text-[8px] font-semibold uppercase text-[#8fa0b6]">
                  {t("dashboard.assistant.conversation.where")}
                </p>
                <p className="mt-1 text-[11px] text-[#8fa0b6]">
                  {t(
                    "dashboard.assistant.conversation.processingFromTranscript"
                  )}
                </p>
              </div>

              <div className="rounded-[10px] border border-dashed border-[#e3e9f2] bg-[#fbfdff] p-6 text-center text-[9px] text-[#c0c9d6]">
                {t("dashboard.assistant.conversation.moreFields")}
              </div>

              <div className="pt-1">
                <Link
                  href="/dashboard?view=reportsubmissionsupport"
                  className="inline-flex h-9 items-center rounded-full bg-[#0f5d9f] px-5 text-[11px] font-bold text-white shadow-[0_8px_18px_rgba(15,93,159,0.25)]"
                >
                  {t("dashboard.assistant.continueToReportSubmission")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { SafeSpeakAssistantConversationPage, SafeSpeakAssistantPage };
