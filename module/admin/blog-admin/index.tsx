import ListBlog from "./ListBlog";
import CreateUpdateBlog from "@module/admin/blog-admin/CreateUpdateBlog";
import React, {useState} from "react";

interface CommonProps {
  changeTab: (tab: string) => void;
  setPostId?: (id: string) => void;
  postId?: string;
}

export function BlogAdmin() {
  const [tab, setTab] = useState("listBlog");
  const [postId, setPostId] = useState<string>("");

  const handleChangeTab = (newTab: string) => {
    if (newTab === "listBlog") {
      setPostId(""); // Reset courseId when going back to list
    }
    setTab(newTab);
  };

  const handleSetCourseId = (id: string) => {
    setPostId(id);
    setTab("createUpdateLesson"); // Auto switch to edit mode
  };

  const tabList = {
    listBlog: {
      component: ListBlog as React.ComponentType<CommonProps>,
    },
    createUpdateBlog: {
      component: CreateUpdateBlog as React.ComponentType<CommonProps>,
    },
  };

  return (
    <div className="">
      <div className="form w-full">
        {React.createElement(tabList[tab as keyof typeof tabList].component, {
          changeTab: handleChangeTab,
          setPostId: handleSetCourseId,
          postId: postId,
        })}
      </div>
    </div>
  );
}
