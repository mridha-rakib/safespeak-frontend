import DashboardScreen from "@/components/dashboard/dashboard-screen";

type DashboardSettingsSearchParams = {
  view?: string | string[];
};

type DashboardSettingsPageProps = {
  searchParams?: Promise<DashboardSettingsSearchParams>;
};

export default async function DashboardSettingsPage({
  searchParams,
}: DashboardSettingsPageProps) {
  const resolved = (await searchParams) ?? {};
  const rawView = resolved.view;
  const view = Array.isArray(rawView) ? rawView[0] : rawView;
  const settingsView =
    view === "support" ? "support" : view === "privacy" ? "privacy" : "overview";

  return <DashboardScreen activeTab="settings" settingsView={settingsView} />;
}
