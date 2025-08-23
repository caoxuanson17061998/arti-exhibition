import Content from "./Content";
import Navbar from "./Navbar";
import "./index.scss";
import {CommonReactProps} from "@app/types";
import Main from "@components/Layout/Main";
import SidebarAdmin from "@components/Layout/admin/SidebarAdmin";
import clsx from "clsx";
import {Noto_Sans_Lao as notoSanLao} from "next/font/google";
import React from "react";

const notoSan = notoSanLao({subsets: ["latin"]});

export default function DashboardAdminLayout({
  children,
}: CommonReactProps): JSX.Element {
  return (
    <div className={clsx(notoSan.className, "wrapper")}>
      <SidebarAdmin />
      <Main>
        <Navbar />
        <Content>{children}</Content>
      </Main>
    </div>
  );
}
