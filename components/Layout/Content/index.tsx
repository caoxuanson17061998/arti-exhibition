import "./index.scss";
import {CommonReactProps} from "@app/types";
import React from "react";

export default function Content({children}: CommonReactProps): JSX.Element {
  // get current route and if not /  padding top to 16px
  const currentRoute = window.location.pathname;
  return (
    <div className={`pt-${currentRoute === "/" ? "0" : "16"} z-0 bg-white`}>
      {children}
    </div>
  );
}
