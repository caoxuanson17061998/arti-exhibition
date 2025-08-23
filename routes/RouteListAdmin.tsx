import {IAccountRole} from "../types";
import IconBlog from "@components/Icon/sidebar/IconBlog";
import IconBlogActive from "@components/Icon/sidebar/IconBlogActive";
import IconDashboard2 from "@components/Icon/sidebar/IconDashboard2";
import IconDashboardActive from "@components/Icon/sidebar/IconDashboardActive";
import IconOrder from "@components/Icon/sidebar/IconOrder";
import IconOrderActive from "@components/Icon/sidebar/IconOrderActive";
import IconProduct from "@components/Icon/sidebar/IconProduct";
import IconProductActive from "@components/Icon/sidebar/IconProductActive";
import IconUser from "@components/Icon/sidebar/IconUser";
import IconUserActive from "@components/Icon/sidebar/IconUserActive";
import {ReactElement} from "react";

// Extended Route type for internal use
export interface ExtendedRoute {
  isHeader?: boolean;
  path: string;
  name: string;
  role?: Array<IAccountRole>;
  icon?: ReactElement;
  iconActive?: ReactElement;
  isSidebar?: boolean;
  isPrivate?: boolean;
  isPublic?: boolean;
  isUpdating?: boolean;
  isAuth?: boolean;
  isSSR?: boolean;
  children?: ExtendedRoute[];
}

const routesAdmin: ExtendedRoute[] = [
  {
    path: "/dashboard",
    name: "Bảng tổng quan",
    icon: <IconDashboard2 />,
    iconActive: <IconDashboardActive />,
    isSSR: true,
    isSidebar: true,
  },

  {
    path: "/user",
    name: "Người dùng",
    icon: <IconUser />,
    iconActive: <IconUserActive />,
    isSidebar: true,
  },
  {
    path: "/products-admin",
    name: "Sản phẩm",
    icon: <IconOrder />,
    iconActive: <IconOrderActive />,
    isSidebar: true,
    children: [
      {
        path: "/product",
        name: "Danh sách sản phẩm",
        isSidebar: true,
      },
      {
        path: "/category",
        name: "Danh mục sản phẩm",
        isSidebar: true,
      },
      {
        path: "/color",
        name: "Danh mục màu sắc",
        isSidebar: true,
      },
      {
        path: "/sizes",
        name: "Danh mục kích thước",
        isSidebar: true,
      },
    ],
  },
  {
    path: "/order-admin",
    name: "Danh sách đơn hàng",
    icon: <IconProduct />,
    iconActive: <IconProductActive />,
    isSidebar: true,
  },
  {
    path: "/blog-admin",
    name: "Blog",
    icon: <IconBlog />,
    iconActive: <IconBlogActive />,
    isSidebar: true,
  },
];

export default routesAdmin;
