"use client";

import type { AssistantIncidentCategory } from "@/lib/assistant-categories";

import { ExplorerPage } from "./dashboard-explorer-page";
import { DashboardShell } from "./dashboard-layout";
import { NotificationsPage } from "./dashboard-notifications-page";
import {
  SettingsPage,
  SettingsPrivacyPolicyPage,
  SettingsSupportPage,
  SettingsTermsConditionsPage,
} from "./dashboard-settings-pages";
import type { DashboardTab, NotificationView, SettingsView } from "./dashboard-types";

export default function DashboardScreen({
  activeTab,
  notificationsView = "today",
  settingsView = "overview",
  explorerCategory,
  explorerFocus,
}: {
  activeTab: Exclude<DashboardTab, "home">;
  notificationsView?: NotificationView;
  settingsView?: SettingsView;
  explorerCategory?: AssistantIncidentCategory;
  explorerFocus?: string;
}) {
  const page =
    activeTab === "explorer" ? (
      <ExplorerPage category={explorerCategory} focus={explorerFocus} />
    ) : activeTab === "notifications" ? (
      <NotificationsPage view={notificationsView} />
    ) : settingsView === "support" ? (
      <SettingsSupportPage />
    ) : settingsView === "privacy" ? (
      <SettingsPrivacyPolicyPage />
    ) : settingsView === "terms" ? (
      <SettingsTermsConditionsPage />
    ) : (
      <SettingsPage />
    );

  return <DashboardShell activeTab={activeTab}>{page}</DashboardShell>;
}
