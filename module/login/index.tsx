import "./index.scss";
import {ForgotPassword} from "@module/login/ForgotPassword";
import {SignIn} from "@module/login/SignIn";
import {SignUp} from "@module/login/SignUp";
import React, {useState} from "react";

export function Login(): JSX.Element {
  const [tab, setTab] = useState("signIn");
  // const user = useSelector((state: IRootState) => state.user);

  const tabList = {
    signIn: {
      component: SignIn,
    },
    signUp: {
      component: SignUp,
    },
    forgotPassword: {
      component: ForgotPassword,
    },
  };

  return (
    <div className="h-screen w-full container-login">
      <div className="bg-white p-6 rounded-2xl">
        <div className="w-full">
          {React.createElement(tabList[tab as keyof typeof tabList].component, {
            changeTab: setTab,
          })}
        </div>
      </div>
    </div>
  );
}
