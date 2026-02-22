import DashboardScreen from "@/components/dashboard/dashboard-screen";

type DashboardReportOverviewPageProps = {
  params: Promise<{
    reportId: string;
  }>;
};

export default async function DashboardReportOverviewPage({
  params,
}: DashboardReportOverviewPageProps) {
  const { reportId } = await params;

  return (
    <DashboardScreen
      activeTab="home"
      homeView="reportoverview"
      reportId={reportId}
    />
  );
}
