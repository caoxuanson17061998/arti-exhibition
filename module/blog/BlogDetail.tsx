import "./index.scss";
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import React from "react";
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

interface RelatedPost {
  id: string;
  title: string;
  image?: string;
  createdAt: string;
}

interface BlogDetailProps {
  id?: string;
  onBack?: () => void;
}

const getImageUrl = (image?: string | null): string => {
  if (!image) {
    return "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=500&fit=crop";
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
      return "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=500&fit=crop";
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

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function BlogDetail({id, onBack}: BlogDetailProps) {
  // Fetch the specific blog post
  const {
    data: post,
    isLoading: isLoadingPost,
    error: postError,
  } = useQuery(
    ["post", id],
    async () => {
      if (!id) throw new Error("Post ID is required");
      const response = await axios.get(`/api/posts?id=${id}`);
      return response.data;
    },
    {
      enabled: !!id,
    },
  );

  // Fetch related posts (other published posts)
  const {data: relatedPostsData} = useQuery(
    ["related-posts", id],
    async () => {
      const response = await axios.get("/api/posts?published=true");
      // Filter out current post and take only first 6
      return response.data.filter((p: BlogPost) => p.id !== id).slice(0, 6);
    },
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  const relatedPosts: RelatedPost[] = relatedPostsData || [];

  if (isLoadingPost) {
    return (
      <div className="w-full bg-white">
        {/* Back to Blog */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              onClick={onBack}
            >
              <ArrowLeftOutlined />
              <span className="text-sm sm:text-base">Quay lại Blog</span>
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center py-32">
          <div className="text-gray-500">Đang tải bài viết...</div>
        </div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="w-full bg-white">
        {/* Back to Blog */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              onClick={onBack}
            >
              <ArrowLeftOutlined />
              <span className="text-sm sm:text-base">Quay lại Blog</span>
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center py-32">
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-2">
              Không tìm thấy bài viết
            </p>
            <p className="text-sm text-gray-500">
              Bài viết có thể đã bị xóa hoặc không tồn tại.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const typedPost: BlogPost = post;

  return (
    <div className="w-full bg-white">
      {/* Back to Blog */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            onClick={onBack}
          >
            <ArrowLeftOutlined />
            <span className="text-sm sm:text-base">Quay lại Blog</span>
          </button>
        </div>
      </div>

      {/* Blog Header */}
      <div className="bg-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-xs sm:text-sm text-gray-500 mb-4">
            {formatDate(typedPost.createdAt)}
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight mb-6">
            {typedPost.title}
          </h1>
          {typedPost.description && (
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {typedPost.description}
            </p>
          )}

          {/* Author info */}
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500">
            <UserOutlined />
            <span>
              Tác giả: {typedPost.author.name || typedPost.author.email}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="lg:flex lg:gap-8">
          {/* Left Content */}
          <div className="lg:w-2/3">
            {/* Main Image */}
            {typedPost.image && (
              <div className="mb-6 lg:mb-8">
                <img
                  src={getImageUrl(typedPost.image)}
                  alt={typedPost.title}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
              {typedPost.content ? (
                <div
                  className="text-sm sm:text-base text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{__html: typedPost.content}}
                />
              ) : (
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {typedPost.description ||
                    "Nội dung bài viết đang được cập nhật..."}
                </p>
              )}
            </div>

            {/* Article Meta */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>Ngày tạo: {formatDateTime(typedPost.createdAt)}</span>
                  {typedPost.updatedAt !== typedPost.createdAt && (
                    <span>Cập nhật: {formatDateTime(typedPost.updatedAt)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-1/3 mt-12 lg:mt-0">
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 sticky top-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
                Bài viết khác
              </h3>

              {relatedPosts.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Chưa có bài viết liên quan
                </p>
              ) : (
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <div
                      key={relatedPost.id}
                      className="flex gap-3 group cursor-pointer"
                    >
                      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20">
                        <img
                          src={getImageUrl(relatedPost.image)}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
                          {relatedPost.title}
                        </h4>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <ClockCircleOutlined className="text-xs" />
                            {formatDate(relatedPost.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
