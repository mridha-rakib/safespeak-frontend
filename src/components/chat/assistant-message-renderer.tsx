"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

type AssistantMessageRendererProps = {
  content: string;
};

export function normalizeAssistantMarkdown(content: string): string {
  return content
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function isExternalHref(href?: string): boolean {
  return /^https?:\/\//i.test(href ?? "");
}

export function AssistantMessageRenderer({
  content,
}: AssistantMessageRendererProps) {
  const normalizedContent = normalizeAssistantMarkdown(content);

  return (
    <div className="assistant-markdown break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          p: ({ node, ...props }) => <p {...props} />,
          strong: ({ node, ...props }) => <strong {...props} />,
          em: ({ node, ...props }) => <em {...props} />,
          ul: ({ node, ...props }) => <ul {...props} />,
          ol: ({ node, ...props }) => <ol {...props} />,
          li: ({ node, ...props }) => <li {...props} />,
          h1: ({ node, ...props }) => <h1 {...props} />,
          h2: ({ node, ...props }) => <h2 {...props} />,
          h3: ({ node, ...props }) => <h3 {...props} />,
          a: ({ node, href, ...props }) => {
            const external = isExternalHref(href);

            return (
              <a
                {...props}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              />
            );
          },
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}
