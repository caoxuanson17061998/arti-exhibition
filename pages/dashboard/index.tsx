import RouteProtection from "@app/components/common/RouteProtection";
import Dashboard from "module/admin/dashboard2";

export default function ProtectedDashboard() {
  return (
    <RouteProtection requiredRole="admin">
      <Dashboard />
    </RouteProtection>
  );
}
