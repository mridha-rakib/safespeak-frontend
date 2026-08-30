"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";

import {
  getDefaultLegalDocumentHtml,
  getPublicLegalContentPage,
  type LegalContentPageKey,
} from "@/lib/content-pages";

type LegalDocumentPageProps = {
  pageKey: LegalContentPageKey;
  title: string;
  intro: string;
  backHref: string;
  backLabel: string;
};

function formatPublishedDate(value?: string): string {
  if (!value) {
    return "Current version";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Current version";
  }

  return `Published ${date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

function sanitizeLegalHtml(value: string): string {
  return value
    .replace(/<\s*(script|iframe|object|embed)\b[^>]*>.*?<\s*\/\s*\1\s*>/gis, "")
    .replace(/<\s*(script|iframe|object|embed)\b[^>]*\/?\s*>/gis, "")
    .replace(/\son[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gis, "")
    .replace(/javascript:/gi, "");
}

export function LegalDocumentPage({
  pageKey,
  title,
  intro,
  backHref,
  backLabel,
}: LegalDocumentPageProps) {
  const [contentHtml, setContentHtml] = useState(() =>
    getDefaultLegalDocumentHtml(pageKey)
  );
  const [publishedAt, setPublishedAt] = useState<string | undefined>();
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    void getPublicLegalContentPage(pageKey)
      .then((contentPage) => {
        if (!isActive) {
          return;
        }

        setContentHtml(
          contentPage.content.contentHtml || getDefaultLegalDocumentHtml(pageKey)
        );
        setPublishedAt(contentPage.publishedAt);
        setLoadError(null);
      })
      .catch(() => {
        if (isActive) {
          setLoadError("Published content is temporarily unavailable.");
        }
      });

    return () => {
      isActive = false;
    };
  }, [pageKey]);

  return (
    <article className="rounded-[18px] border border-[#dbe4f0] bg-white px-4 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:px-7 sm:py-8">
      <div className="flex flex-col gap-3 border-b border-[#e1e8f2] pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0f5d9f]">
            {formatPublishedDate(publishedAt)}
          </p>
          <h1 className="mt-2 text-[32px] font-extrabold leading-[1.05] text-[#1f2a3a] sm:text-[40px]">
            {title}
          </h1>
          <p className="mt-2 max-w-[760px] text-sm leading-[1.65] text-[#6a7d94]">
            {intro}
          </p>
        </div>

        <Link
          href={backHref as Route}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-[#d6e0ec] bg-white px-4 text-xs font-semibold text-[#0f5d9f] transition hover:bg-[#f7fbff]"
        >
          {backLabel}
        </Link>
      </div>

      {loadError ? (
        <p className="mt-4 rounded-[14px] border border-[#fde2e2] bg-[#fff7f7] px-3 py-2 text-xs font-semibold text-[#9f3a3a]">
          {loadError}
        </p>
      ) : null}

      <div
        className="mt-6 text-sm leading-[1.75] text-[#42546b] [&_a]:font-semibold [&_a]:text-[#0f5d9f] [&_h2]:mb-3 [&_h2]:mt-7 [&_h2:first-child]:mt-0 [&_h2]:text-[22px] [&_h2]:font-extrabold [&_h2]:text-[#1f2a3a] [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:mb-4"
        dangerouslySetInnerHTML={{ __html: sanitizeLegalHtml(contentHtml) }}
      />
    </article>
  );
}
