import CreateUpdateProductComponent from "@module/admin/products-admin/product/CreateUpdateProductComponent";
import ListProductComponent from "@module/admin/products-admin/product/ListProductComponent";
import React, {useState} from "react";

interface CommonProps {
  changeTab: (tab: string) => void;
  setProductId?: (id: string) => void;
  productId?: string;
}

export function ProductAdminController() {
  const [tab, setTab] = useState("listProduct");
  const [productId, setProductId] = useState<string>("");

  const handleChangeTab = (newTab: string) => {
    if (newTab === "listProduct") {
      setProductId("");
    }
    setTab(newTab);
  };

  const handleSetProductId = (id: string) => {
    setProductId(id);
    setTab("createUpdateProduct");
  };

  const tabList = {
    listProduct: {
      component: ListProductComponent as React.ComponentType<CommonProps>,
    },
    createUpdateProduct: {
      component:
        CreateUpdateProductComponent as React.ComponentType<CommonProps>,
    },
  };

  return (
    <div className="">
      <div className="form w-full">
        {React.createElement(tabList[tab as keyof typeof tabList].component, {
          changeTab: handleChangeTab,
          setProductId: handleSetProductId,
          productId: productId,
        })}
      </div>
    </div>
  );
}
