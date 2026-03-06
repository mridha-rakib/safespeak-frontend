"use client";

import { ExplorerPage } from "./dashboard-explorer-page";
import { DashboardShell } from "./dashboard-layout";
import { NotificationsPage } from "./dashboard-notifications-page";
import {
  SettingsPage,
  SettingsPrivacyPolicyPage,
  SettingsSupportPage,
} from "./dashboard-settings-pages";
import type { DashboardTab, NotificationView, SettingsView } from "./dashboard-types";

export default function DashboardScreen({
  activeTab,
  notificationsView = "today",
  settingsView = "overview",
}: {
  activeTab: Exclude<DashboardTab, "home">;
  notificationsView?: NotificationView;
  settingsView?: SettingsView;
}) {
  const page =
    activeTab === "explorer" ? (
      <ExplorerPage />
    ) : activeTab === "notifications" ? (
      <NotificationsPage view={notificationsView} />
    ) : settingsView === "support" ? (
      <SettingsSupportPage />
    ) : settingsView === "privacy" ? (
      <SettingsPrivacyPolicyPage />
    ) : (
      <SettingsPage />
    );

  return <DashboardShell activeTab={activeTab}>{page}</DashboardShell>;
}
