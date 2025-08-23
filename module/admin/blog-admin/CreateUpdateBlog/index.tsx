"use client";

import Tag from "@app/utils";
import CKEditorWrapper from "@components/CKEditorWrapper";
import {yupResolver} from "@hookform/resolvers/yup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardMedia,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {useSelector} from "react-redux";
import * as yup from "yup";

// Default placeholder image (a simple gray rectangle SVG data URL)
const DEFAULT_IMAGE_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQzMCIgdmlld0JveD0iMCAwIDcwMCA0MzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI3MDAiIGhlaWdodD0iNDMwIiBmaWxsPSIjRjNGNEY2Ii8+Cjxzdmcgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiB2aWV3Qm94PSIwIDAgNjQgNjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeD0iMzE4IiB5PSIxODMiPgo8cGF0aCBkPSJNNTYgNDhWMTZDNTYgMTMuNzkgNTQuMjEgMTIgNTIgMTJIMTJDOS43OSAxMiA4IDEzLjc5IDggMTZWNDhDOCA1MC4yMSA5Ljc5IDUyIDEyIDUySDUyQzU0LjIxIDUyIDU2IDUwLjIxIDU2IDQ4WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTYgMzJDMTkuMzEzNyAzMiAyMiAyOS4zMTM3IDIyIDI2QzIyIDIyLjY4NjMgMTkuMzEzNyAyMCAxNiAyMEMxMi42ODYzIDIwIDEwIDIyLjY4NjMgMTAgMjZDMTAgMjkuMzEzNyAxMi42ODYzIDMyIDE2IDMyWiIgZmlsbD0iIzY3NzQ4QyIvPgo8cGF0aCBkPSJNOCA0OEw4IDQwTDE2IDMyTDI0IDQwSDMyTDQ4IDI0TDU2IDMyVjQ4SDhaIiBmaWxsPSIjNjc3NDhDIi8+Cjwvc3ZnPgo8L3N2Zz4K";

// Helper function to get image URL and handle CORS issues
const getImageUrl = (image?: string | null): string => {
  if (!image) {
    return DEFAULT_IMAGE_PLACEHOLDER;
  }

  // If it's a base64 data URL or blob URL (from file upload), use as is
  if (image.startsWith("data:") || image.startsWith("blob:")) {
    return image;
  }

  // If image is already a full URL, extract the path and use proxy
  if (image.startsWith("http")) {
    try {
      const url = new URL(image);
      return url.pathname; // This will go through Next.js proxy
    } catch (error) {
      console.warn("Invalid image URL:", image);
      return DEFAULT_IMAGE_PLACEHOLDER;
    }
  }

  // If it's a relative path, construct it
  return image.startsWith("/") ? image : `/${image}`;
};

// Form validation schema
const schema = yup.object({
  title: yup.string().required("Tiêu đề không được bỏ trống"),
  description: yup.string().optional(),
  content: yup.string().required("Nội dung không được bỏ trống"),
  isActive: yup.boolean().required(),
});

type BlogFormData = yup.InferType<typeof schema>;

interface CreateUpdateBlogProps {
  changeTab?: (tab: string) => void;
  postId?: string;
}

export default function CreateUpdateBlog({
  changeTab,
  postId,
}: CreateUpdateBlogProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const queryClient = useQueryClient();
  const {user} = useSelector((state: any) => state.user);

  // Load post detail if editing
  const {data: postDetail, isLoading: isLoadingPostDetail} = useQuery(
    ["postDetail", postId],
    async () => {
      if (!postId) return null;
      const response = await axios.get(`/api/posts?id=${postId}`);
      return response.data;
    },
    {
      enabled: !!postId,
    },
  );

  const createPostMutation = useMutation(
    async (data: BlogFormData) => {
      if (!user?.id) {
        throw new Error("Bạn cần đăng nhập để tạo bài viết");
      }

      let imageUrl = null;

      // Convert image to base64 if selectedFile exists
      if (selectedFile) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(selectedFile);
        });

        imageUrl = await base64Promise;
      }

      const response = await axios.post("/api/posts", {
        title: data.title,
        description: data.description,
        content: data.content,
        image: imageUrl,
        authorId: user.id,
        published: data.isActive,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("posts");
        if (changeTab) {
          changeTab("listBlog");
        }
      },
      onError: (error: any) => {
        console.error("Error creating post:", error);
        // You might want to show a toast or alert here
        alert(error.message || "Có lỗi xảy ra khi tạo bài viết");
      },
    },
  );

  const updatePostMutation = useMutation(
    async (data: BlogFormData) => {
      if (!postId) throw new Error("Post ID is required for update");

      let imageUrl = postDetail?.image; // Keep existing image by default

      // Convert new image to base64 if selectedFile exists
      if (selectedFile) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(selectedFile);
        });

        imageUrl = await base64Promise;
      } else if (previewImage === null) {
        // User removed the image
        imageUrl = null;
      }

      const response = await axios.put(`/api/posts?id=${postId}`, {
        title: data.title,
        description: data.description,
        content: data.content,
        image: imageUrl,
        published: data.isActive,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("posts");
        queryClient.invalidateQueries(["postDetail", postId]);
        if (changeTab) {
          changeTab("listBlog");
        }
      },
      onError: (error: any) => {
        console.error("Error updating post:", error);
        alert(
          error.response?.data?.error || "Có lỗi xảy ra khi cập nhật bài viết",
        );
      },
    },
  );

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<BlogFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      isActive: false,
    },
  });

  // Transform API data to form format
  const transformApiDataToForm = (apiData: any): BlogFormData => {
    return {
      title: apiData.title || "",
      description: apiData.description || "",
      content: apiData.content || "",
      isActive: apiData.published === true,
    };
  };

  // Reset form when API data is loaded OR when switching between create/edit mode
  useEffect(() => {
    if (postId && postDetail && !isLoadingPostDetail) {
      // Edit mode: populate form with existing data
      const formData = transformApiDataToForm(postDetail);
      reset(formData);

      // Set preview image from backend if exists and reset selected file
      setSelectedFile(null);
      if (postDetail.image) {
        setPreviewImage(postDetail.image);
      } else {
        setPreviewImage(null);
      }
    } else if (!postId) {
      // Create mode: reset form to default values
      reset({
        title: "",
        description: "",
        content: "",
        isActive: false,
      });
      setSelectedFile(null);
      setPreviewImage(null);
    }
  }, [postId, postDetail, isLoadingPostDetail, reset]);

  const onSubmit = (data: BlogFormData) => {
    if (postId) {
      updatePostMutation.mutate(data);
    } else {
      createPostMutation.mutate(data);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file); // Store the actual file for upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    // Reset to original image from backend or null
    if (postDetail?.image) {
      setPreviewImage(postDetail.image);
    } else {
      setPreviewImage(null);
    }
  };

  const isEditMode = !!postId;
  const pageTitle = isEditMode ? "Cập nhật bài viết" : "Thêm bài viết";
  const buttonText = isEditMode ? "Cập nhật bài viết" : "Tạo bài viết";

  // Show loading state when editing and data is still loading
  if (isEditMode && isLoadingPostDetail) {
    return (
      <div className="p-4">
        <Box className="flex justify-center items-center py-8">
          <Typography>Đang tải dữ liệu bài viết...</Typography>
        </Box>
      </div>
    );
  }

  // Show error state when editing but post not found
  if (isEditMode && !isLoadingPostDetail && !postDetail) {
    return (
      <div className="p-4">
        <Box className="flex flex-col justify-center items-center py-8">
          <Typography color="error" className="mb-4">
            Không tìm thấy bài viết hoặc bạn không có quyền truy cập
          </Typography>
          <button
            onClick={() => changeTab && changeTab("listBlog")}
            className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Quay lại danh sách
          </button>
        </Box>
      </div>
    );
  }

  return (
    <>
      <div className="p-4">
        <Box>
          <h4 className="font-bold mb-1 text-2xl">Danh sách bài viết</h4>
          <div className="text-gray-500 text-sm">
            <div className="text-gray-400 text-sm flex mt-2">
              <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
              <span className="text-[#212B36]">Blog</span> <Tag /> {pageTitle}
            </div>
          </div>
        </Box>
      </div>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-4"
      >
        <Accordion defaultExpanded className="mb-4 shadow-sm border">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="div">
              <div className="font-semibold text-lg">Chi tiết</div>
              <div className="text-[#637381] font-light">
                Tiêu đề, mô tả ngắn, hình ảnh...
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Controller
              name="title"
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  label="Tiêu đề bài viết"
                  fullWidth
                  margin="normal"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  placeholder="Vd: Bài viết về tranh nghệ thuật"
                  className="border border-[#919EAB52]"
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  label="Mô tả ngắn (tùy chọn)"
                  multiline
                  rows={4}
                  fullWidth
                  className="border border-[#919EAB52]"
                  margin="normal"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  placeholder="Nhập mô tả ngắn về nội dung bài viết..."
                />
              )}
            />

            <Typography component="div" className="font-medium">
              <div className="mt-4 mb-1 font-medium">Nội dung</div>
            </Typography>
            <Controller
              name="content"
              control={control}
              render={({field}) => (
                <CKEditorWrapper
                  value={field.value || ""}
                  onChange={(data: string) => {
                    field.onChange(data);
                  }}
                  placeholder="Nhập nội dung bài viết..."
                />
              )}
            />

            <div className="mt-6 w-full">
              <div className="font-medium mb-2">Hình thu nhỏ</div>
              <input
                accept="image/*"
                className="hidden"
                id="upload-image"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="upload-image" className="w-full">
                <Card
                  className="w-full max-w-md h-48 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400"
                  sx={{
                    backgroundColor: previewImage ? "transparent" : "#f7f7f7",
                  }}
                >
                  {previewImage ? (
                    <CardMedia
                      component="img"
                      image={getImageUrl(previewImage)}
                      alt={selectedFile ? "Ảnh mới được chọn" : "Ảnh hiện tại"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_IMAGE_PLACEHOLDER;
                      }}
                    />
                  ) : (
                    <Box className="text-center">
                      <Typography className="text-gray-500 mb-2">
                        Kích thước: 700x430 pixel
                      </Typography>
                      <Typography className="text-gray-500">
                        {isEditMode
                          ? "Thay đổi ảnh (JPG, PNG, SVG, WEBP)"
                          : "Tải ảnh lên (JPG, PNG, SVG, WEBP)"}
                      </Typography>
                    </Box>
                  )}
                </Card>
              </label>
              <Typography component="div" className="font-light">
                <div className="flex items-center gap-1 mb-2 mt-2">
                  <InfoIcon fontSize="small" color="disabled" />
                  <span className="break-words">
                    <span className="text-[#212B36] font-semibold">
                      Kích thước:{" "}
                    </span>{" "}
                    700x430 pixel,{" "}
                    <span className="text-[#212B36] font-semibold">
                      {" "}
                      Hỗ trợ tệp:{" "}
                    </span>{" "}
                    JPG, JPEG, PNG, GIF, WEBP
                  </span>
                </div>
                {selectedFile && (
                  <div className="flex items-center justify-between text-green-600 text-sm mt-1">
                    <span>
                      ✓ Đã chọn: {selectedFile.name} (
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      Xóa
                    </button>
                  </div>
                )}
                {!selectedFile && postDetail?.image && previewImage && (
                  <div className="flex items-center justify-between text-blue-600 text-sm mt-1">
                    <span>✓ Ảnh hiện tại từ hệ thống</span>
                    <button
                      type="button"
                      onClick={() => setPreviewImage(null)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      Ẩn ảnh
                    </button>
                  </div>
                )}
              </Typography>
            </div>
          </AccordionDetails>
        </Accordion>

        <Box className="flex justify-between">
          <div className="flex gap-2 items-center">
            <Controller
              name="isActive"
              control={control}
              render={({field}) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                    />
                  }
                  label="Xuất bản"
                />
              )}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (changeTab) {
                  changeTab("listBlog");
                }
              }}
              className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-[#212B36] text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-900"
              disabled={
                createPostMutation.isLoading || updatePostMutation.isLoading
              }
            >
              {createPostMutation.isLoading || updatePostMutation.isLoading
                ? "Đang xử lý..."
                : buttonText}
            </button>
          </div>
        </Box>
      </Box>
    </>
  );
}
