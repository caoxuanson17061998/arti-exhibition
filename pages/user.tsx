import RouteProtection from "@app/components/common/RouteProtection";
import {User} from "module/admin/user";

export default function ProtectedUserManagement() {
  return (
    <RouteProtection requiredRole="admin">
      <User />
    </RouteProtection>
  );
}
