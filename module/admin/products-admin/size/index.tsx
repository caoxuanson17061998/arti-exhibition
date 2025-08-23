import CreateUpdateSizeComponent from "./CreateUpdateSizeComponent";
import ListSizeComponent from "./ListSizeComponent";
import React, {useState} from "react";

interface CommonProps {
  changeTab: (tab: string) => void;
  setSizeId?: (id: string) => void;
  sizeId?: string;
}

export function SizeAdminController() {
  const [tab, setTab] = useState("listSize");
  const [sizeId, setSizeId] = useState<string>("");

  const handleChangeTab = (newTab: string) => {
    if (newTab === "listSize") {
      setSizeId("");
    }
    setTab(newTab);
  };

  const handleSetSizeId = (id: string) => {
    setSizeId(id);
    setTab("createUpdateSize");
  };

  const tabList = {
    listSize: {
      component: ListSizeComponent as React.ComponentType<CommonProps>,
    },
    createUpdateSize: {
      component: CreateUpdateSizeComponent as React.ComponentType<CommonProps>,
    },
  };

  return (
    <div className="">
      <div className="form w-full">
        {React.createElement(tabList[tab as keyof typeof tabList].component, {
          changeTab: handleChangeTab,
          setSizeId: handleSetSizeId,
          sizeId: sizeId,
        })}
      </div>
    </div>
  );
}
