import DashboardScreen from "@/components/dashboard/dashboard-screen";

type DashboardPageSearchParams = {
  view?: string | string[];
};

type DashboardPageProps = {
  searchParams?: Promise<DashboardPageSearchParams>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolved = (await searchParams) ?? {};
  const rawView = resolved.view;
  const view = Array.isArray(rawView) ? rawView[0] : rawView;
  const homeView =
    view === "microeducation"
      ? "microeducation"
      : view === "microcards"
        ? "microcards"
        : view === "microcarddetail"
          ? "microcarddetail"
          : view === "assistant"
            ? "assistant"
        : "overview";

  return <DashboardScreen activeTab="home" homeView={homeView} />;
}
