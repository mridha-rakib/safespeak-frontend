"use client";

import dynamic from "next/dynamic";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import type { AssistantIncidentCategory } from "@/lib/assistant-categories";
import type { DashboardCardFlowId } from "@/lib/dashboard-card-flows";
import { LAST_NON_CONVERSATION_DASHBOARD_URL_STORAGE_KEY } from "@/lib/dashboard-navigation";

import { DashboardShell } from "./dashboard-layout";
import type { HomeView } from "./dashboard-types";

function DashboardViewFallback() {
  return <div className="px-4 py-6 text-sm text-[#60718a]">Loading...</div>;
}

const HomeDashboardPage = dynamic(
  () =>
    import("./dashboard-home-overview-page").then(
      (module) => module.HomeDashboardPage
    ),
  { loading: DashboardViewFallback }
);
const MicroEducationPage = dynamic(
  () =>
    import("./dashboard-microeducation-page").then(
      (module) => module.MicroEducationPage
    ),
  { loading: DashboardViewFallback }
);
const ResourcesPage = dynamic(
  () =>
    import("./dashboard-safety-pages").then((module) => module.ResourcesPage),
  { loading: DashboardViewFallback }
);
const LocalIntelligencePage = dynamic(
  () =>
    import("./dashboard-safety-pages").then(
      (module) => module.LocalIntelligencePage
    ),
  { loading: DashboardViewFallback }
);
const SmartDiallerPage = dynamic(
  () =>
    import("./dashboard-safety-pages").then(
      (module) => module.SmartDiallerPage
    ),
  { loading: DashboardViewFallback }
);
const SafetyPlanManager = dynamic(
  () =>
    import("./dashboard-safety-pages").then(
      (module) => module.SafetyPlanManager
    ),
  { loading: DashboardViewFallback }
);
const MicroCardsPage = dynamic(
  () =>
    import("./dashboard-microcards-pages").then(
      (module) => module.MicroCardsPage
    ),
  { loading: DashboardViewFallback }
);
const MicroCardDetailPage = dynamic(
  () =>
    import("./dashboard-microcards-pages").then(
      (module) => module.MicroCardDetailPage
    ),
  { loading: DashboardViewFallback }
);
const SafeSpeakAssistantConversationPage = dynamic(
  () =>
    import("./dashboard-assistant-pages").then(
      (module) => module.SafeSpeakAssistantConversationPage
    ),
  { loading: DashboardViewFallback }
);
const SafeSpeakAssistantPage = dynamic(
  () =>
    import("./dashboard-assistant-pages").then(
      (module) => module.SafeSpeakAssistantPage
    ),
  { loading: DashboardViewFallback }
);
const ScamShieldIntakePage = dynamic(
  () =>
    import("./dashboard-scam-shield-pages").then(
      (module) => module.ScamShieldIntakePage
    ),
  { loading: DashboardViewFallback }
);
const ScamShieldRiskPage = dynamic(
  () =>
    import("./dashboard-scam-shield-pages").then(
      (module) => module.ScamShieldRiskPage
    ),
  { loading: DashboardViewFallback }
);
const ScamShieldAssetsPage = dynamic(
  () =>
    import("./dashboard-scam-shield-pages").then(
      (module) => module.ScamShieldAssetsPage
    ),
  { loading: DashboardViewFallback }
);
const ScamShieldAgencyPage = dynamic(
  () =>
    import("./dashboard-scam-shield-pages").then(
      (module) => module.ScamShieldAgencyPage
    ),
  { loading: DashboardViewFallback }
);
const ReportsHistoryPage = dynamic(
  () =>
    import("./dashboard-reports-pages").then(
      (module) => module.ReportsHistoryPage
    ),
  { loading: DashboardViewFallback }
);
const ReportOverviewPage = dynamic(
  () =>
    import("./dashboard-reports-pages").then(
      (module) => module.ReportOverviewPage
    ),
  { loading: DashboardViewFallback }
);
const ReportSubmissionSupportPage = dynamic(
  () =>
    import("./dashboard-report-submission-pages/report-submission-support-page").then(
      (module) => module.ReportSubmissionSupportPage
    ),
  { loading: DashboardViewFallback }
);
const ReportSubmissionRecommendationsPage = dynamic(
  () =>
    import("./dashboard-report-submission-pages/report-submission-recommendations-page").then(
      (module) => module.ReportSubmissionRecommendationsPage
    ),
  { loading: DashboardViewFallback }
);
const ReportSubmissionHistoryPage = dynamic(
  () =>
    import("./dashboard-report-submission-pages/report-submission-history-page").then(
      (module) => module.ReportSubmissionHistoryPage
    ),
  { loading: DashboardViewFallback }
);
const ReportSubmissionDetailedExplanationsPage = dynamic(
  () =>
    import("./dashboard-report-submission-pages/report-submission-detailed-explanations-page").then(
      (module) => module.ReportSubmissionDetailedExplanationsPage
    ),
  { loading: DashboardViewFallback }
);
const ReportSubmissionDetailsPage = dynamic(
  () =>
    import("./dashboard-report-submission-pages/report-submission-details-page").then(
      (module) => module.ReportSubmissionDetailsPage
    ),
  { loading: DashboardViewFallback }
);
const ReportSubmissionEvidencePage = dynamic(
  () =>
    import("./dashboard-report-submission-pages/report-submission-evidence-page").then(
      (module) => module.ReportSubmissionEvidencePage
    ),
  { loading: DashboardViewFallback }
);
const ReportSubmissionReviewPage = dynamic(
  () =>
    import("./dashboard-report-submission-pages/report-submission-review-page").then(
      (module) => module.ReportSubmissionReviewPage
    ),
  { loading: DashboardViewFallback }
);
const ReportSubmissionSharePage = dynamic(
  () =>
    import("./dashboard-report-submission-pages/report-submission-share-page").then(
      (module) => module.ReportSubmissionSharePage
    ),
  { loading: DashboardViewFallback }
);

export default function DashboardHomeScreen({
  homeView = "overview",
  assistantStartFresh = false,
  assistantRecording = false,
  assistantVoiceMode = false,
  assistantMessage,
  assistantPrefillMessage,
  reportId,
  assistantCategory,
  assistantTopic,
}: {
  homeView?: HomeView;
  assistantStartFresh?: boolean;
  assistantRecording?: boolean;
  assistantVoiceMode?: boolean;
  assistantMessage?: string;
  assistantPrefillMessage?: string;
  reportId?: string;
  assistantCategory?: AssistantIncidentCategory;
  assistantTopic?: DashboardCardFlowId;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      homeView === "assistantconversation" ||
      !pathname
    ) {
      return;
    }

    const search = searchParams.toString();
    const currentUrl = search ? `${pathname}?${search}` : pathname;

    window.sessionStorage.setItem(
      LAST_NON_CONVERSATION_DASHBOARD_URL_STORAGE_KEY,
      currentUrl
    );
  }, [homeView, pathname, searchParams]);

  const page =
    homeView === "resources" ? (
      <ResourcesPage />
    ) : homeView === "localintelligence" ? (
      <LocalIntelligencePage />
    ) : homeView === "smartdialler" ? (
      <SmartDiallerPage />
    ) : homeView === "safetyplan" ? (
      <SafetyPlanManager />
    ) : homeView === "microeducation" ? (
      <MicroEducationPage />
    ) : homeView === "microcards" ? (
      <MicroCardsPage />
    ) : homeView === "microcarddetail" ? (
      <MicroCardDetailPage />
    ) : homeView === "assistantconversation" ? (
      <SafeSpeakAssistantConversationPage
        initialMessage={assistantMessage}
        initialPrefillMessage={assistantPrefillMessage}
        initialCategory={assistantCategory}
        initialTopic={assistantTopic}
        startVoiceMode={assistantVoiceMode}
      />
    ) : homeView === "assistant" ? (
      <SafeSpeakAssistantPage
        startFresh={assistantStartFresh}
        isRecording={assistantRecording}
        initialCategory={assistantCategory}
        initialTopic={assistantTopic}
      />
    ) : homeView === "scamshieldintake" ? (
      <ScamShieldIntakePage initialTopic={assistantTopic} />
    ) : homeView === "scamshieldrisk" ? (
      <ScamShieldRiskPage />
    ) : homeView === "scamshieldassets" ? (
      <ScamShieldAssetsPage />
    ) : homeView === "scamshieldagency" ? (
      <ScamShieldAgencyPage />
    ) : homeView === "reportshistory" ? (
      <ReportsHistoryPage />
    ) : homeView === "reportoverview" ? (
      <ReportOverviewPage reportId={reportId} />
    ) : homeView === "reportsubmissionsupport" ? (
      <ReportSubmissionSupportPage />
    ) : homeView === "reportsubmissionrecommendations" ? (
      <ReportSubmissionRecommendationsPage />
    ) : homeView === "reportsubmissionhistory" ? (
      <ReportSubmissionHistoryPage />
    ) : homeView === "reportsubmissiondetailedexplanations" ? (
      <ReportSubmissionDetailedExplanationsPage />
    ) : homeView === "reportsubmissiondetails" ? (
      <ReportSubmissionDetailsPage
        initialCategory={assistantCategory}
        initialTopic={assistantTopic}
        initialMessage={assistantMessage}
      />
    ) : homeView === "reportsubmissionevidence" ? (
      <ReportSubmissionEvidencePage />
    ) : homeView === "reportsubmissionreview" ? (
      <ReportSubmissionReviewPage />
    ) : homeView === "reportsubmissionshare" ? (
      <ReportSubmissionSharePage />
    ) : (
      <HomeDashboardPage />
    );

  return (
    <DashboardShell activeTab="home" homeView={homeView}>
      {page}
    </DashboardShell>
  );
}
