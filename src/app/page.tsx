import { getAllScenarios } from "@/lib/scenarios";
import { DashboardClient } from "@/components/dashboard-client";

export default function DashboardPage() {
  const scenarios = getAllScenarios();

  return <DashboardClient scenarios={scenarios} />;
}
