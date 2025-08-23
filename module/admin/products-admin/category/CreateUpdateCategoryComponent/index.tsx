import Tag from "@app/utils";
import {yupResolver} from "@hookform/resolvers/yup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import axios, {AxiosError} from "axios";
import React, {useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import {useMutation, useQuery, useQueryClient} from "react-query";
import * as yup from "yup";

interface CreateUpdateCategoryProps {
  changeTab?: (tab: string) => void;
  categoryId?: string;
}

interface ApiError {
  error: string;
}

const schema = yup.object({
  name: yup
    .string()
    .required("Category name is required")
    .max(255, "Category name must not exceed 255 characters"),
});

type CategoryFormData = yup.InferType<typeof schema>;

export default function CreateUpdateCategoryComponent({
  changeTab,
  categoryId,
}: CreateUpdateCategoryProps) {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    setError,
  } = useForm<CategoryFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const {data: categoryDetail, isLoading: isLoadingCategoryDetail} = useQuery(
    ["categoryDetail", categoryId],
    async () => {
      if (!categoryId) return null;
      const res = await axios.get(`/api/categories?id=${categoryId}`);
      return res.data;
    },
    {enabled: !!categoryId},
  );

  const handleApiError = (error: unknown) => {
    const axiosError = error as AxiosError<ApiError>;
    const message = axiosError?.response?.data?.error;

    if (
      message?.toLowerCase().includes("exists") ||
      message?.includes("already")
    ) {
      setError("name", {
        type: "manual",
        message,
      });
    }
  };

  const createCategoryMutation = useMutation(
    async (data: CategoryFormData) => {
      const res = await axios.post("/api/categories", data);
      return res.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("categories");
        if (changeTab) changeTab("listCategory");
      },
      onError: handleApiError,
    },
  );

  const updateCategoryMutation = useMutation(
    async (data: CategoryFormData) => {
      const res = await axios.put(`/api/categories?id=${categoryId}`, data);
      return res.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("categories");
        if (categoryId)
          await queryClient.invalidateQueries(["categoryDetail", categoryId]);
        if (changeTab) changeTab("listCategory");
      },
      onError: handleApiError,
    },
  );

  useEffect(() => {
    if (categoryId && categoryDetail && !isLoadingCategoryDetail) {
      reset({name: categoryDetail.name});
    } else if (!categoryId) {
      reset({name: ""});
    }
  }, [categoryId, categoryDetail, isLoadingCategoryDetail, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    if (categoryId) {
      updateCategoryMutation.mutate(data);
    } else {
      createCategoryMutation.mutate(data);
    }
  };
  const pageTitle = categoryId ? "Cập nhật bộ sưu tập" : "Thêm mới bộ sưu tập";

  return (
    <Box className="max-w-2xl mx-auto p-4">
      <Box>
        <Typography variant="h5" className="font-bold mb-4">
          {pageTitle}
        </Typography>
        <div className="text-gray-500 text-sm">
          <div className="text-gray-400 text-sm flex mt-2">
            <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
            <span className="text-[#212B36]">Sản phẩm</span> <Tag />
            <span className="text-[#212B36]">
              Danh mục sản phẩm{" "}
            </span> <Tag /> {pageTitle}
          </div>
        </div>
      </Box>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Accordion defaultExpanded className="mb-4">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className="font-medium">
              Thông tin bộ sưu tập:
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Controller
              name="name"
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Tên bộ sưu tập"
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </AccordionDetails>
        </Accordion>
        <Box className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={() => changeTab && changeTab("listCategory")}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={
              createCategoryMutation.isLoading ||
              updateCategoryMutation.isLoading
            }
          >
            {createCategoryMutation.isLoading ||
            updateCategoryMutation.isLoading
              ? "Đang xử lý..."
              : categoryId
              ? "Cập nhật"
              : "Tạo mới"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
