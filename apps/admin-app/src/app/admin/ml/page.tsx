import { ReportsTable } from "../../../components/admin/ReportsTable";
import { StatsCards } from "../../../components/admin/StatsCards";

export default function MlDashboardRoute() {
  return (
    <>
      <StatsCards />
      <ReportsTable product="ml" />
    </>
  );
}
