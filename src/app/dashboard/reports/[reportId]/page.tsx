import DashboardHomeScreen from "@/components/dashboard/dashboard-home-screen";

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
    <DashboardHomeScreen homeView="reportoverview" reportId={reportId} />
  );
}
