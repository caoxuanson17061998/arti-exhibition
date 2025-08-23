import CreateUpdateColor from "@module/admin/products-admin/color/CreateUpdateColor";
import ListColorComponent from "@module/admin/products-admin/color/ListColorComponent";
import React, {useState} from "react";

interface CommonProps {
  changeTab: (tab: string) => void;
  setColorId?: (id: string) => void;
  colorId?: string;
}

export function ColorAdminController() {
  const [tab, setTab] = useState("listColor");
  const [colorId, setColorId] = useState<string>("");

  const handleChangeTab = (newTab: string) => {
    if (newTab === "listColor") {
      setColorId("");
    }
    setTab(newTab);
  };

  const handleSetCourseId = (id: string) => {
    setColorId(id);
    setTab("createUpdateColor");
  };

  const tabList = {
    listColor: {
      component: ListColorComponent as React.ComponentType<CommonProps>,
    },
    createUpdateColor: {
      component: CreateUpdateColor as React.ComponentType<CommonProps>,
    },
  };

  return (
    <div className="">
      <div className="form w-full">
        {React.createElement(tabList[tab as keyof typeof tabList].component, {
          changeTab: handleChangeTab,
          setColorId: handleSetCourseId,
          colorId: colorId,
        })}
      </div>
    </div>
  );
}
