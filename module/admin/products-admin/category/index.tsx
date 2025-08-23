import CreateUpdateCategoryComponent from "@module/admin/products-admin/category/CreateUpdateCategoryComponent";
import ListCategoryComponent from "@module/admin/products-admin/category/ListCategoryComponent";
import React, {useState} from "react";

interface CommonProps {
  changeTab: (tab: string) => void;
  setCategoryId?: (id: string) => void;
  categoryId?: string;
}

export function CategoryAdminController() {
  const [tab, setTab] = useState("listCategory");
  const [categoryId, setCategoryId] = useState<string>("");

  const handleChangeTab = (newTab: string) => {
    if (newTab === "listCategory") {
      setCategoryId("");
    }
    setTab(newTab);
  };

  const handleSetCategoryId = (id: string) => {
    setCategoryId(id);
    setTab("createUpdateCategory");
  };

  const tabList = {
    listCategory: {
      component: ListCategoryComponent as React.ComponentType<CommonProps>,
    },
    createUpdateCategory: {
      component:
        CreateUpdateCategoryComponent as React.ComponentType<CommonProps>,
    },
  };

  return (
    <div className="">
      <div className="form w-full">
        {React.createElement(tabList[tab as keyof typeof tabList].component, {
          changeTab: handleChangeTab,
          setCategoryId: handleSetCategoryId,
          categoryId: categoryId,
        })}
      </div>
    </div>
  );
}
