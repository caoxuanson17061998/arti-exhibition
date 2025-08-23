import Content from "./Content";
import "./index.scss";
import Config from "@app/config";
import {CommonReactProps} from "@app/types";
import FooterComponent from "@components/Layout/Footer";
import HeaderComponent from "@components/Layout/Header";
import Main from "@components/Layout/Main";
import clsx from "clsx";
import {Noto_Sans_Lao as notoSanLao} from "next/font/google";
import React from "react";

const notoSan = notoSanLao({subsets: ["latin"]});

export default function DashboardLayout({
  children,
}: CommonReactProps): JSX.Element {
  const {useHeader, useFooter} = Config.LAYOUT_CONFIG;
  return (
    <div className={clsx(notoSan.className, "wrapper")}>
      <Main>
        {useHeader && <HeaderComponent />}
        <Content>{children}</Content>
        {useFooter && <FooterComponent />}
      </Main>
    </div>
  );
}
