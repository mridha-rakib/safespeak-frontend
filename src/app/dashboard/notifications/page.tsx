import DashboardScreen from "@/components/dashboard/dashboard-screen";

type DashboardNotificationsSearchParams = {
  view?: string | string[];
};

type DashboardNotificationsPageProps = {
  searchParams?: Promise<DashboardNotificationsSearchParams>;
};

export default async function DashboardNotificationsPage({
  searchParams,
}: DashboardNotificationsPageProps) {
  const resolved = (await searchParams) ?? {};
  const rawView = resolved.view;
  const view = Array.isArray(rawView) ? rawView[0] : rawView;
  const notificationsView = view === "past" ? "past" : "today";

  return (
    <DashboardScreen
      activeTab="notifications"
      notificationsView={notificationsView}
    />
  );
}
