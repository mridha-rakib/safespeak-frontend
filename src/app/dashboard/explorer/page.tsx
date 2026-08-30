import DashboardScreen from "@/components/dashboard/dashboard-screen";
import {
  isAssistantIncidentCategory,
  type AssistantIncidentCategory,
} from "@/lib/assistant-categories";

type DashboardExplorerPageSearchParams = {
  category?: string | string[];
  focus?: string | string[];
};

type DashboardExplorerPageProps = {
  searchParams?: Promise<DashboardExplorerPageSearchParams>;
};

export default async function DashboardExplorerPage({
  searchParams,
}: DashboardExplorerPageProps) {
  const resolved = (await searchParams) ?? {};
  const rawCategory = resolved.category;
  const rawFocus = resolved.focus;
  const categoryValue = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory;
  const focusValue = Array.isArray(rawFocus) ? rawFocus[0] : rawFocus;
  const explorerCategory: AssistantIncidentCategory | undefined = isAssistantIncidentCategory(
    categoryValue
  )
    ? categoryValue
    : undefined;

  return (
    <DashboardScreen
      activeTab="explorer"
      explorerCategory={explorerCategory}
      explorerFocus={typeof focusValue === "string" ? focusValue : undefined}
    />
  );
}
