import CreateUpdateScentComponent from "@module/admin/products-admin/scent/CreateUpdateScentComponent";
import ListScentComponent from "@module/admin/products-admin/scent/ListScentComponent";
import React, {useState} from "react";

interface CommonProps {
  changeTab: (tab: string) => void;
  setScentId?: (id: string) => void;
  scentId?: string;
}

export function ScentAdminController() {
  const [tab, setTab] = useState("listScent");
  const [scentId, setScentId] = useState<string>("");

  const handleChangeTab = (newTab: string) => {
    if (newTab === "listScent") {
      setScentId("");
    }
    setTab(newTab);
  };

  const handleSetScentId = (id: string) => {
    setScentId(id);
    setTab("createUpdateScent");
  };

  const tabList = {
    listScent: {
      component: ListScentComponent as React.ComponentType<CommonProps>,
    },
    createUpdateScent: {
      component: CreateUpdateScentComponent as React.ComponentType<CommonProps>,
    },
  };

  return (
    <div className="">
      <div className="form w-full">
        {React.createElement(tabList[tab as keyof typeof tabList].component, {
          changeTab: handleChangeTab,
          setScentId: handleSetScentId,
          scentId: scentId,
        })}
      </div>
    </div>
  );
}
