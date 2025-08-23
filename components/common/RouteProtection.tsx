import Config from "@app/config";
import {IRootState} from "@app/redux/store";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {useSelector} from "react-redux";

interface RouteProtectionProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
  allowedRoles?: ("admin" | "user")[];
}

export default function RouteProtection({
  children,
  requiredRole,
  allowedRoles = ["admin", "user"],
}: RouteProtectionProps) {
  const router = useRouter();
  const {user} = useSelector((state: IRootState) => state.user);

  useEffect(() => {
    // Nếu chưa login
    if (!user) {
      router.replace(Config.PATHNAME.LOGIN);
      return;
    }

    // Nếu có requiredRole cụ thể
    if (requiredRole && user.role !== requiredRole) {
      // Redirect dựa trên logic: admin → dashboard, user → home
      if (user.role === "admin") {
        router.replace(Config.PATHNAME.DASHBOARD);
      } else {
        router.replace(Config.PATHNAME.HOME);
      }
      return;
    }

    // Nếu có allowedRoles và user role không nằm trong danh sách
    if (allowedRoles && !allowedRoles.includes(user.role as any)) {
      console.warn(
        `🚫 Access denied: User role "${
          user.role
        }" not in allowed roles: [${allowedRoles.join(", ")}]`,
      );

      // Redirect dựa trên logic: admin → dashboard, user → home
      if (user.role === "admin") {
        router.replace(Config.PATHNAME.DASHBOARD);
      } else {
        router.replace(Config.PATHNAME.HOME);
      }
    }
  }, [user, router, requiredRole, allowedRoles]);

  // Nếu chưa login hoặc không có quyền -> không render
  if (!user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role as any)) {
    return null;
  }

  return children;
}
