import DashboardAdminLayout from "../components/Layout/DashboardAdminLayout";
import DashboardLayout from "../components/Layout/DashboardLayout";
import Config from "../config";
import RouteList, {ExtendedRoute} from "./RouteList";
import LoginComponent from "@app/pages/login";
import {IRootState} from "@app/redux/store";
import {AppProps} from "next/app";
import {useRouter} from "next/router";
import React from "react";
import {useSelector} from "react-redux";

// ✅ ĐỊNH NGHĨA ADMIN ROUTES (routes chỉ admin mới được truy cập)
const ADMIN_ROUTES = [
  "/dashboard",
  "/user",
  "/users/admin",
  "/users/roles",
  "/products-admin",
  "/products-admin/product",
  "/products-admin/category",
  "/products-admin/color",
  "/products-admin/scent",
  "/order-admin",
  "/blog-admin",
  "/study/categories",
  "/study/list",
  "/study/questions",
];

// ✅ ĐỊNH NGHĨA ROUTES CẦN LOGIN (chỉ có payment)
const PROTECTED_USER_ROUTES = ["/payment"];

export default function Routes({
  Component,
  pageProps,
  router,
}: AppProps): JSX.Element | null {
  const routerNext = useRouter();

  const login = routerNext.pathname === Config.PATHNAME.LOGIN;

  const isRoute = (key: keyof ExtendedRoute): boolean => {
    for (const route of RouteList) {
      if (router.pathname === route.path) {
        return !!route[key];
      }
    }
    return false;
  };

  // ✅ HELPER FUNCTIONS - Kiểm tra quyền truy cập route
  const isAdminRoute = (pathname: string): boolean => {
    return ADMIN_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    );
  };

  const isProtectedUserRoute = (pathname: string): boolean => {
    return PROTECTED_USER_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    );
  };

  const {user} = useSelector((state: IRootState) => state.user);

  const goToLogin = (): null => {
    router.push(Config.PATHNAME.LOGIN);
    return null;
  };

  if (typeof window === "undefined") {
    return null;
  }

  // Nếu đang ở trang login
  if (login) {
    return <LoginComponent />;
  }

  // Nếu route là public (không cần login)
  if (isRoute("isPublic")) {
    return <Component {...pageProps} />;
  }

  const currentPath = router.pathname;

  // ✅ KIỂM TRA ADMIN ROUTES - Bắt buộc login + role admin
  if (isAdminRoute(currentPath)) {
    if (!user) {
      return goToLogin();
    }
    if (user.role !== "admin") {
      router.push(Config.PATHNAME.HOME); // User redirect về trang chủ
      return null;
    }
    // ✅ Admin có quyền truy cập
    return (
      <DashboardAdminLayout>
        <Component {...pageProps} />
      </DashboardAdminLayout>
    );
  }

  // ✅ KIỂM TRA PROTECTED USER ROUTES - Chỉ có /payment cần login
  if (isProtectedUserRoute(currentPath) && !user) {
    return goToLogin();
  }

  // ✅ TẤT CẢ ROUTES KHÁC - Bọc trong DashboardLayout (có thể login hoặc không)
  return (
    <DashboardLayout>
      <Component {...pageProps} />
    </DashboardLayout>
  );
}
