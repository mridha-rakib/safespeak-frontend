"use client";

import { DashboardShell } from "./dashboard-layout";
import { SafeSpeakAssistantConversationPage, SafeSpeakAssistantPage } from "./dashboard-assistant-pages";
import { ExplorerPage } from "./dashboard-explorer-page";
import { HomeDashboardPage } from "./dashboard-home-overview-page";
import { MicroEducationPage } from "./dashboard-microeducation-page";
import { MicroCardDetailPage, MicroCardsPage } from "./dashboard-microcards-pages";
import { NotificationsPage } from "./dashboard-notifications-page";
import { ReportOverviewPage, ReportsHistoryPage } from "./dashboard-reports-pages";
import {
  ReportSubmissionDetailedExplanationsPage,
  ReportSubmissionDetailsPage,
  ReportSubmissionEvidencePage,
  ReportSubmissionRecommendationsPage,
  ReportSubmissionReviewPage,
  ReportSubmissionSuccessPage,
  ReportSubmissionSupportPage,
} from "./dashboard-report-submission-pages";
import { ScamShieldAgencyPage, ScamShieldAssetsPage, ScamShieldIntakePage, ScamShieldRiskPage } from "./dashboard-scam-shield-pages";
import {
  SettingsPage,
  SettingsPrivacyPolicyPage,
  SettingsSupportPage,
} from "./dashboard-settings-pages";
import type {
  DashboardTab,
  HomeView,
  NotificationView,
  SettingsView,
} from "./dashboard-types";

export default function DashboardScreen({
  activeTab,
  homeView = "overview",
  notificationsView = "today",
  settingsView = "overview",
  assistantRecording = false,
  assistantMessage,
  reportId,
}: {
  activeTab: DashboardTab;
  homeView?: HomeView;
  notificationsView?: NotificationView;
  settingsView?: SettingsView;
  assistantRecording?: boolean;
  assistantMessage?: string;
  reportId?: string;
}) {
  let page: React.ReactNode;

  if (activeTab === "home") {
    page =
      homeView === "microeducation" ? (
        <MicroEducationPage />
      ) : homeView === "microcards" ? (
        <MicroCardsPage />
      ) : homeView === "microcarddetail" ? (
        <MicroCardDetailPage />
      ) : homeView === "assistantconversation" ? (
        <SafeSpeakAssistantConversationPage initialMessage={assistantMessage} />
      ) : homeView === "assistant" ? (
        <SafeSpeakAssistantPage isRecording={assistantRecording} />
      ) : homeView === "scamshieldintake" ? (
        <ScamShieldIntakePage />
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
      ) : homeView === "reportsubmissiondetailedexplanations" ? (
        <ReportSubmissionDetailedExplanationsPage />
      ) : homeView === "reportsubmissiondetails" ? (
        <ReportSubmissionDetailsPage />
      ) : homeView === "reportsubmissionevidence" ? (
        <ReportSubmissionEvidencePage />
      ) : homeView === "reportsubmissionreview" ? (
        <ReportSubmissionReviewPage />
      ) : homeView === "reportsubmissionsuccess" ? (
        <ReportSubmissionSuccessPage />
      ) : (
        <HomeDashboardPage />
      );
  } else if (activeTab === "explorer") {
    page = <ExplorerPage />;
  } else if (activeTab === "notifications") {
    page = <NotificationsPage view={notificationsView} />;
  } else {
    page =
      settingsView === "support" ? (
        <SettingsSupportPage />
      ) : settingsView === "privacy" ? (
        <SettingsPrivacyPolicyPage />
      ) : (
        <SettingsPage />
      );
  }

  return (
    <DashboardShell activeTab={activeTab} homeView={homeView}>
      {page}
    </DashboardShell>
  );
}
