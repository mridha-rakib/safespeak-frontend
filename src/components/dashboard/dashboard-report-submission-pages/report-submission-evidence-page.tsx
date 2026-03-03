"use client";

import Image from "next/image";
import Link from "next/link";

import {
  IconAlertCircleFilled,
  IconBoltFilled,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconFileText,
  IconFolderFilled,
  IconMicrophone,
  IconX,
} from "@tabler/icons-react";

import domesticViolanceImage from "@/assets/domestic-violance.jpg";
import hackerImage from "@/assets/hacker.jpg";

function ReportSubmissionEvidencePage() {
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
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#9ba8bb]">
            <IconClock size={12} />
          </span>
        </div>

        <article className="mt-3 rounded-[16px] border border-[#dce5f1] bg-[#f7fafe] p-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-4">
          <article className="rounded-[14px] border border-[#e4ebf4] bg-white p-3 sm:p-4">
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

            <div className="mt-2 rounded-xl border border-[#e2e9f4] bg-[#f9fbff] p-2.5">
              <textarea
                rows={3}
                placeholder="Describe the incident details thoroughly. Include time, location, and involved parties..."
                className="w-full resize-none bg-transparent text-[11px] leading-[1.5] text-[#2a3a4f] outline-none placeholder:text-[#a0afc2]"
              />
              <div className="mt-2 flex justify-end">
                <button className="inline-flex h-7 items-center gap-1 rounded-md border border-[#dee6f2] bg-white px-2.5 text-[10px] font-semibold text-[#5f7189]">
                  <IconMicrophone size={11} />
                  Dictate
                </button>
              </div>
            </div>
          </article>

          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#1f2a3a]">Attached Files</h3>
              <p className="mt-0.5 text-[10px] text-[#8ea0b8]">
                Upload evidence to support your report.
              </p>
            </div>
            <span className="inline-flex h-5 items-center rounded-full bg-[#fff2e6] px-2.5 text-[9px] font-bold text-[#ff8f00]">
              3 Files Ready
            </span>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-3">
            <article className="overflow-hidden rounded-xl border border-[#dde7f2] bg-white">
              <div className="relative h-[122px] w-full">
                <Image
                  src={domesticViolanceImage}
                  alt="Road image evidence"
                  fill
                  className="object-cover"
                />
                <button className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/40 text-white">
                  <IconX size={11} />
                </button>
              </div>
              <div className="flex items-end justify-between p-2">
                <p className="truncate pr-2 text-[9px] font-semibold text-[#1f2a3a]">
                  road_scene_01.jpg
                </p>
                <p className="text-[9px] text-[#95a6bc]">2.4 MB</p>
              </div>
            </article>

            <article className="overflow-hidden rounded-xl border border-[#dde7f2] bg-white">
              <div className="relative h-[122px] w-full">
                <Image
                  src={hackerImage}
                  alt="Video evidence"
                  fill
                  className="object-cover"
                />
                <span className="absolute left-1/2 top-1/2 inline-flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#5f7189]">
                  <IconChevronRight size={16} />
                </span>
                <button className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/40 text-white">
                  <IconX size={11} />
                </button>
                <span className="absolute bottom-2 right-2 inline-flex h-4 items-center rounded-full bg-black/55 px-1.5 text-[8px] font-semibold text-white">
                  0:45
                </span>
              </div>
            </article>

            <article className="relative rounded-xl border border-[#dde7f2] bg-white p-3">
              <button className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[#a7b4c6]">
                <IconX size={12} />
              </button>
              <div className="grid min-h-[122px] place-items-center">
                <div className="text-center">
                  <span className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1e4] text-[#ff8f00]">
                    <IconFileText size={16} />
                  </span>
                  <p className="mt-3 text-[10px] font-semibold text-[#1f2a3a]">
                    evidence_doc.pdf
                  </p>
                  <p className="text-[9px] text-[#95a6bc]">1.2 MB</p>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
            <article className="rounded-xl border border-dashed border-[#ffbf7d] bg-white p-3">
              <button className="mb-2 ml-auto inline-flex h-4 w-4 items-center justify-center rounded-full text-[#a7b4c6]">
                <IconX size={10} />
              </button>
              <div className="flex items-start gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#fff1e4] text-[#ff8f00]">
                  <IconAlertCircleFilled size={12} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[9px] font-semibold text-[#1f2a3a]">
                    audio_record_01.mp3
                  </p>
                  <p className="text-[9px] text-[#ff8f00]">Uploading...</p>
                  <div className="mt-2 h-1.5 rounded-full bg-[#ffe6cc]">
                    <div className="h-1.5 w-1/2 rounded-full bg-[#ff8f00]" />
                  </div>
                  <p className="mt-1 text-right text-[9px] text-[#95a6bc]">50%</p>
                </div>
              </div>
            </article>

            <article className="grid min-h-[102px] place-items-center rounded-xl border border-dashed border-[#ced9e8] bg-[#fbfcff] p-3 text-center">
              <div>
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#fff1e4] text-[#ff8f00]">
                  <IconFolderFilled size={13} />
                </span>
                <p className="mt-2 text-[10px] font-semibold text-[#334155]">
                  Drag & Drop or Click
                </p>
                <p className="mt-1 text-[9px] text-[#8ea0b8]">
                  Support for images, video, audio, and PDF documents.
                </p>
              </div>
            </article>
          </div>

          <div className="mt-2 flex items-center gap-2 rounded-xl border border-[#dfe7f2] bg-white px-3 py-2.5">
            <input
              type="text"
              placeholder="Type a message to support..."
              className="flex-1 bg-transparent text-[11px] text-[#2a3a4f] outline-none placeholder:text-[#a0afc2]"
            />
            <button className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#8ea0b8]">
              <IconMicrophone size={12} />
            </button>
            <button className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#ff8f00] text-white shadow-[0_6px_14px_rgba(255,143,0,0.35)]">
              <IconChevronRight size={14} />
            </button>
          </div>

          <div className="mt-3 rounded-xl border border-[#dfe7f2] bg-white px-3 py-3 sm:px-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button className="inline-flex h-9 items-center justify-center rounded-full px-5 text-[11px] font-semibold text-[#6d7f96]">
                Save as Draft
              </button>
              <Link
                href="/dashboard?view=reportsubmissionreview"
                className="inline-flex h-9 items-center justify-center rounded-full bg-[#ff8f00] px-8 text-[11px] font-bold text-white shadow-[0_8px_18px_rgba(255,143,0,0.32)]"
              >
                Continue
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export { ReportSubmissionEvidencePage };
