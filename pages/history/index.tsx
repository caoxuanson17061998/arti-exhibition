import RouteProtection from "@app/components/common/RouteProtection";
import {History} from "module/history";

export default function ProtectedHistory() {
  return (
    <RouteProtection requiredRole="user">
      <History />
    </RouteProtection>
  );
}
