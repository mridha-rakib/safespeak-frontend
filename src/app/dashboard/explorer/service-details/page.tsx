import { ExplorerServiceDetailsPage } from "@/components/dashboard/dashboard-explorer-service-details-page";
import { DashboardShell } from "@/components/dashboard/dashboard-layout";

type DashboardExplorerServiceDetailsPageSearchParams = {
  service?: string | string[];
};

type DashboardExplorerServiceDetailsPageProps = {
  searchParams?: Promise<DashboardExplorerServiceDetailsPageSearchParams>;
};

export default async function DashboardExplorerServiceDetailsPage({
  searchParams,
}: DashboardExplorerServiceDetailsPageProps) {
  const resolved = (await searchParams) ?? {};
  const rawService = resolved.service;
  const serviceId = Array.isArray(rawService) ? rawService[0] : rawService;

  return (
    <DashboardShell activeTab="explorer">
      <ExplorerServiceDetailsPage serviceId={serviceId} />
    </DashboardShell>
  );
}
