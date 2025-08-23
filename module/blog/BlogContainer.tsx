import "./index.scss";
import {ArrowRightOutlined, ClockCircleOutlined} from "@ant-design/icons";
import {PageHeader} from "@components/PageHeader";
import {Pagination} from "antd";
import axios from "axios";
import React, {useMemo, useState} from "react";
import {useQuery} from "react-query";

interface BlogPost {
  id: string;
  title: string;
  description?: string;
  content?: string;
  image?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    name?: string;
    email: string;
  };
}

interface BlogProps {
  onBlogClick?: (id: string) => void;
}

const getImageUrl = (image?: string | null): string => {
  if (!image) {
    return "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=250&fit=crop";
  }

  // If image is a base64 data URL, return as-is
  if (image.startsWith("data:image/")) {
    return image;
  }

  // If image is already a full URL, extract the path and use proxy
  if (image.startsWith("http")) {
    try {
      const url = new URL(image);
      return url.pathname; // This will go through Next.js proxy
    } catch (error) {
      return "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=250&fit=crop";
    }
  }

  // If it's a relative path, construct it
  return image.startsWith("/") ? image : `/${image}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function BlogContainer({onBlogClick}: BlogProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Fetch published posts from API
  const {data: postsData, isLoading} = useQuery(
    ["published-posts"],
    async () => {
      const response = await axios.get("/api/posts?published=true");
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  const blogPosts: BlogPost[] = postsData || [];

  // Paginate posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return blogPosts.slice(startIndex, endIndex);
  }, [blogPosts, currentPage, postsPerPage]);

  const totalPosts = blogPosts.length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBlogClick = (id: string) => {
    if (onBlogClick) {
      onBlogClick(id);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white">
        <PageHeader
          title="Blog"
          subtitle="Thắp sáng từng khoảnh khắc bằng hương thơm thuần khiết"
          backgroundImage="/img/blog.png"
        />
        <div className="flex justify-center items-center py-16">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white pb-10">
      <PageHeader
        title="Blog"
        subtitle="Chuyện nghệ thuật - Chia sẻ cảm hứng"
        backgroundImage="/img/blog.svg"
      />

      {/* List of blog posts */}
      <div className="blog-container mt-10 sm:mt-16 lg:mt-20 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {blogPosts.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-gray-500 text-center">
              <p className="text-lg mb-2">Chưa có bài viết nào</p>
              <p className="text-sm">
                Hãy quay lại sau để đọc những bài viết mới nhất!
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {paginatedPosts.map((post) => (
                <div key={post.id} className="blog-card bg-white group">
                  {/* Blog Image - Responsive height */}
                  <div
                    role="presentation"
                    className="blog-image w-full h-48 sm:h-56 lg:h-64 mb-3 sm:mb-4 overflow-hidden cursor-pointer"
                    onClick={() => handleBlogClick(post.id)}
                  >
                    <img
                      src={getImageUrl(post.image)}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-xl sm:rounded-2xl transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Blog Content */}
                  <div className="space-y-2 sm:space-y-3">
                    {/* Title - Responsive typography */}
                    <h3
                      role="presentation"
                      className="blog-title text-base sm:text-lg lg:text-xl cursor-pointer line-clamp-2 font-medium leading-tight hover:text-primary transition-colors duration-200"
                      onClick={() => handleBlogClick(post.id)}
                    >
                      {post.title}
                    </h3>

                    {/* Description - Responsive typography */}
                    {post.description && (
                      <p className="line-clamp-2 text-[#5F6369] text-sm sm:text-base leading-relaxed">
                        {post.description}
                      </p>
                    )}

                    {/* Date and Read More - Responsive spacing and typography */}
                    <div className="flex items-center justify-between pt-2 sm:pt-3">
                      <span className="text-[#999999] text-xs sm:text-sm flex items-center gap-1">
                        <ClockCircleOutlined className="text-xs sm:text-sm" />
                        <span className="hidden sm:inline">
                          {formatDate(post.createdAt)}
                        </span>
                      </span>

                      <button
                        onClick={() => handleBlogClick(post.id)}
                        className="read-more-btn flex items-center gap-1 text-xs sm:text-sm font-medium hover:text-primary transition-colors duration-200"
                      >
                        <span>Đọc thêm</span>
                        <ArrowRightOutlined className="text-xs sm:text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination - Responsive positioning and spacing */}
            {totalPosts > postsPerPage && (
              <div className="flex justify-center mt-8 sm:mt-12 lg:mt-16 mb-10 sm:mb-16 lg:mb-20">
                <Pagination
                  current={currentPage}
                  total={totalPosts}
                  pageSize={postsPerPage}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showQuickJumper={false}
                  className="blog-pagination"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
