import PaymentStep1 from "@module/payment/PaymentStep1";
import PaymentStep2 from "@module/payment/PaymentStep2";
import React, {useState} from "react";

export function Payment() {
  const [tab, setTab] = useState("paymentStep1");

  const tabList = {
    paymentStep1: {
      component: PaymentStep1,
    },
    paymentStep2: {
      component: PaymentStep2,
    },
  };

  return (
    <div className="w-full">
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
