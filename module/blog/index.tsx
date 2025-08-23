import {BlogDetail} from "./BlogDetail";
import {BlogContainer} from "@module/blog/BlogContainer";
import React, {useState} from "react";

export function Blog() {
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const handleBlogClick = (id: string) => {
    setSelectedBlogId(id);
  };

  const handleBackToBlog = () => {
    setSelectedBlogId(null);
  };

  if (selectedBlogId) {
    return <BlogDetail id={selectedBlogId} onBack={handleBackToBlog} />;
  }

  return <BlogContainer onBlogClick={handleBlogClick} />;
}
