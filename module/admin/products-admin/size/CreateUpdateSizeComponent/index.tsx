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

interface CreateUpdateSizeProps {
  changeTab?: (tab: string) => void;
  sizeId?: string;
}

interface ApiError {
  error: string;
}

const schema = yup.object({
  name: yup
    .string()
    .required("Tên kích thước là bắt buộc")
    .max(255, "Tên kích thước không được vượt quá 255 ký tự"),
});
type SizeFormData = yup.InferType<typeof schema>;

export default function CreateUpdateSizeComponent({
  changeTab,
  sizeId,
}: CreateUpdateSizeProps) {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    setError,
  } = useForm<SizeFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const {data: sizeDetail, isLoading: isLoadingSizeDetail} = useQuery(
    ["sizeDetail", sizeId],
    async () => {
      if (!sizeId) return null;
      const res = await axios.get(`/api/sizes?id=${sizeId}`);
      return res.data;
    },
    {enabled: !!sizeId},
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

  const createSizeMutation = useMutation(
    async (data: SizeFormData) => {
      const res = await axios.post("/api/sizes", data);
      return res.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("sizes");
        if (changeTab) changeTab("listSize");
      },
      onError: handleApiError,
    },
  );

  const updateSizeMutation = useMutation(
    async (data: SizeFormData) => {
      const res = await axios.put(`/api/sizes?id=${sizeId}`, data);
      return res.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("sizes");
        if (sizeId) await queryClient.invalidateQueries(["sizeDetail", sizeId]);
        if (changeTab) changeTab("listSize");
      },
      onError: handleApiError,
    },
  );

  useEffect(() => {
    if (sizeId && sizeDetail && !isLoadingSizeDetail) {
      reset({
        name: sizeDetail.name,
      });
    } else if (!sizeId) {
      reset({name: ""});
    }
  }, [sizeId, sizeDetail, isLoadingSizeDetail, reset]);

  const onSubmit = async (data: SizeFormData) => {
    if (sizeId) {
      updateSizeMutation.mutate(data);
    } else {
      createSizeMutation.mutate(data);
    }
  };
  const pageTitle = sizeId ? "Cập nhật kích thước" : "Thêm mới kích thước";

  return (
    <Box className="max-w-2xl mx-auto p-4">
      <Box>
        <Typography variant="h5" className="font-bold mb-4">
          {pageTitle}
        </Typography>
        <div className="text-gray-500 text-sm">
          <div className="text-gray-400 text-sm flex mt-2">
            <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
            <span className="text-[#212B36]">Sản phẩm</span> <Tag /> {pageTitle}
          </div>
        </div>
      </Box>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Accordion defaultExpanded className="mb-4">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className="font-medium">
              Thông tin kích thước:
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
                  label="Tên kích thước"
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
            onClick={() => changeTab && changeTab("listSize")}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={
              createSizeMutation.isLoading || updateSizeMutation.isLoading
            }
          >
            {createSizeMutation.isLoading || updateSizeMutation.isLoading
              ? "Đang xử lý..."
              : sizeId
              ? "Cập nhật"
              : "Tạo mới"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
