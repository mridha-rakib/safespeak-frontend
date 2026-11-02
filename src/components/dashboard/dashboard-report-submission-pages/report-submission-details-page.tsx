"use client";

import type { AssistantIncidentCategory } from "@/lib/assistant-categories";
import type { DashboardCardFlowId } from "@/lib/dashboard-card-flows";

import { ReportSubmissionEvidencePage } from "./report-submission-evidence-page";

function ReportSubmissionDetailsPage({
  initialCategory,
  initialTopic,
  initialMessage,
}: {
  initialCategory?: AssistantIncidentCategory;
  initialTopic?: DashboardCardFlowId;
  initialMessage?: string;
}) {
  return (
    <ReportSubmissionEvidencePage
      initialCategory={initialCategory}
      initialTopic={initialTopic}
      initialMessage={initialMessage}
    />
  );
}

export { ReportSubmissionDetailsPage };
