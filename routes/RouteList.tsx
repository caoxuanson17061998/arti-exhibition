import {IAccountRole} from "../types";
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

const routes: ExtendedRoute[] = [
  {
    path: "/",
    name: "Trang chủ",
    icon: undefined,
    isSidebar: true,
  },
  {
    path: "/products",
    name: "Sản phẩm",
    icon: undefined,
    isSidebar: true,
  },
  {
    path: "/your-design",
    name: "Thiết kế của riêng bạn",
    icon: undefined,
    isSidebar: true,
  },
  {
    path: "/charity",
    name: "Từ thiện",
    icon: undefined,
    isSSR: true,
    isSidebar: true,
  },
  {
    path: "/blog",
    name: "Blog",
    icon: undefined,
    isSidebar: true,
  },
];

export default routes;
