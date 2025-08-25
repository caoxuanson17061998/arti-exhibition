import {ProductFormData, productSchema} from "@app/schema/productSchema";
import Tag from "@app/utils";
import ControlledBooleanSelect from "@components/common/ControlledBooleanSelect";
import ControlledEnumSelect from "@components/common/ControlledEnumSelect";
import ControlledMultiSelect from "@components/common/ControlledMultiSelect";
import ControlledTextField from "@components/common/ControlledTextField";
import ImageUploadField from "@components/common/ImageUploadField";
import {yupResolver} from "@hookform/resolvers/yup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import axios, {AxiosError} from "axios";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQuery, useQueryClient} from "react-query";

interface CreateUpdateProductProps {
  changeTab?: (tab: string) => void;
  productId?: string;
}

interface OptionItem {
  id: string;
  name: string;
}

interface ApiError {
  error: string;
}

export default function CreateUpdateProductComponent({
  changeTab,
  productId,
}: CreateUpdateProductProps) {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    setError,
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      originalPrice: 0,
      salePrice: 0,
      thumbnailUrl: "",
      imageUrls: [],
      colorIds: [],
      sizeIds: [],
      categoryIds: [],
    },
  });

  const {data: productDetail} = useQuery(
    ["productDetail", productId],
    async () => {
      if (!productId) return null;
      const res = await axios.get(`/api/products?id=${productId}`);
      return res.data;
    },
    {enabled: !!productId},
  );

  const {data: colorOptions} = useQuery<OptionItem[]>("colors", async () => {
    const res = await axios.get("/api/colors");
    return res.data;
  });

  const {data: sizeOptions} = useQuery<OptionItem[]>("sizes", async () => {
    const res = await axios.get("/api/sizes");
    return res.data;
  });

  const {data: categoryOptions} = useQuery<OptionItem[]>(
    "categories",
    async () => {
      const res = await axios.get("/api/categories");
      return res.data;
    },
  );
  const handleApiError = (error: unknown) => {
    const axiosError = error as AxiosError<ApiError>;
    const message = axiosError?.response?.data?.error || "Unknown error";

    if (message.toLowerCase().includes("slug")) {
      setError("slug", {type: "manual", message});
    } else {
      setError("name", {type: "manual", message});
    }
  };

  const createMutation = useMutation(
    async (data: ProductFormData) => {
      const res = await axios.post("/api/products", data);
      return res.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("products");
        if (changeTab) changeTab("listProduct");
      },
      onError: handleApiError,
    },
  );

  const updateMutation = useMutation(
    async (data: ProductFormData) => {
      const res = await axios.put(`/api/products?id=${productId}`, data);
      return res.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("products");
        if (productId)
          await queryClient.invalidateQueries(["productDetail", productId]);
        if (changeTab) changeTab("listProduct");
      },
      onError: handleApiError,
    },
  );

  useEffect(() => {
    if (productId && productDetail) {
      reset({
        name: productDetail.name,
        slug: productDetail.slug,
        description: productDetail.description ?? "",
        originalPrice: productDetail.originalPrice,
        salePrice: productDetail.salePrice,
        thumbnailUrl: productDetail.thumbnailUrl || "",
        imageUrls: productDetail.imageUrls || [],
        colorIds: productDetail.colors?.map((c: any) => c.color.id) || [],
        sizeIds: productDetail.sizes?.map((s: any) => s.size.id) || [],
        categoryIds:
          productDetail.categories?.map((c: any) => c.category.id) || [],
      });
    }
  }, [productId, productDetail, reset]);

  const onSubmit = (data: ProductFormData) => {
    console.log("Submit product data:", data);
    if (productId) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isEditMode = !!productId;
  const pageTitle = isEditMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm";
  const buttonText = isEditMode ? "Cập nhật sản phẩm" : "Tạo mới sản phẩm";

  return (
    <>
      <div className="p-4">
        <Box>
          <h4 className="font-bold mb-1 text-2xl">Quản lý sản phẩm</h4>
          <div className="text-gray-500 text-sm">
            <div className="text-gray-400 text-sm flex mt-2">
              <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
              <span className="text-[#212B36]">Sản phẩm</span> <Tag />{" "}
              {pageTitle}
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
              <div className="font-semibold text-lg">Thông tin cơ bản</div>
              <div className="text-[#637381] font-light">
                Tên sản phẩm, đường dẫn, mô tả...
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ControlledTextField
              name="name"
              control={control}
              label="Tên sản phẩm"
              error={errors.name}
            />
            <ControlledTextField
              name="slug"
              control={control}
              label="Đường dẫn (slug)"
              error={errors.slug}
            />
            <ControlledTextField
              name="description"
              control={control}
              label="Mô tả ngắn"
              multiline
              rows={3}
              error={errors.description}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded className="mb-4 shadow-sm border">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="div">
              <div className="font-semibold text-lg">Hình ảnh</div>
              <div className="text-[#637381] font-light">
                Ảnh đại diện và ảnh phụ của sản phẩm
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ImageUploadField
              name="thumbnailUrl"
              control={control}
              label="Ảnh đại diện (thumbnail)"
              multiple={false}
            />
            <ImageUploadField
              name="imageUrls"
              control={control}
              label="Ảnh phụ (tối đa 5 ảnh)"
              multiple
              maxFiles={5}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded className="mb-4 shadow-sm border">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="div">
              <div className="font-semibold text-lg">Giá cả</div>
              <div className="text-[#637381] font-light">
                Giá gốc và giá khuyến mãi
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ControlledTextField
              name="originalPrice"
              control={control}
              label="Giá gốc"
              type="number"
              error={errors.originalPrice}
            />
            <ControlledTextField
              name="salePrice"
              control={control}
              label="Giá khuyến mãi"
              type="number"
              error={errors.salePrice}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded className="mb-4 shadow-sm border">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="div">
              <div className="font-semibold text-lg">Thuộc tính</div>
              <div className="text-[#637381] font-light">
                Kích thước, phân loại...
              </div>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ControlledMultiSelect
              name="categoryIds"
              control={control}
              label="Danh mục sản phẩm"
              options={categoryOptions || []}
            />
            <ControlledMultiSelect
              name="colorIds"
              control={control}
              label="Màu sắc"
              options={colorOptions || []}
            />
            <ControlledMultiSelect
              name="sizeIds"
              control={control}
              label="Kích thước"
              options={sizeOptions || []}
            />
          </AccordionDetails>
        </Accordion>

        <Box className="flex justify-end">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => changeTab && changeTab("listProduct")}
              className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-[#212B36] text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-900"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {createMutation.isLoading || updateMutation.isLoading
                ? "Đang xử lý..."
                : buttonText}
            </button>
          </div>
        </Box>
      </Box>
    </>
  );
}
