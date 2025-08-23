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

interface CreateUpdateColorProps {
  changeTab?: (tab: string) => void;
  colorId?: string;
}

interface ApiError {
  error: string;
}

const schema = yup.object({
  name: yup
    .string()
    .required("Tên màu là bắt buộc")
    .max(255, "Tên màu không được vượt quá 255 ký tự"),
  hexCode: yup
    .string()
    .matches(/^#([0-9A-Fa-f]{3}){1,2}$/, "Sai định dạng mã màu không hợp lệ")
    .required("Mã màu là bắt buộc"),
});

type ColorFormData = yup.InferType<typeof schema>;

export default function CreateUpdateColor({
  changeTab,
  colorId,
}: CreateUpdateColorProps) {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    setError,
  } = useForm<ColorFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      hexCode: "",
    },
  });

  const {data: colorDetail, isLoading: isLoadingColorDetail} = useQuery(
    ["colorDetail", colorId],
    async () => {
      if (!colorId) return null;
      const res = await axios.get(`/api/colors?id=${colorId}`);
      return res.data;
    },
    {enabled: !!colorId},
  );

  const handleApiError = (error: unknown) => {
    const axiosError = error as AxiosError<ApiError>;
    const message = axiosError?.response?.data?.error;

    if (
      message?.toLowerCase().includes("exists") ||
      message?.toLowerCase().includes("already")
    ) {
      setError("name", {
        type: "manual",
        message,
      });
    }
  };

  const createColorMutation = useMutation(
    async (data: ColorFormData) => {
      const res = await axios.post("/api/colors", data);
      return res.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("colors");
        if (changeTab) changeTab("listColor");
      },
      onError: handleApiError,
    },
  );

  const updateColorMutation = useMutation(
    async (data: ColorFormData) => {
      const res = await axios.put(`/api/colors?id=${colorId}`, data);
      return res.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("colors");
        if (colorId)
          await queryClient.invalidateQueries(["colorDetail", colorId]);
        if (changeTab) changeTab("listColor");
      },
      onError: handleApiError,
    },
  );

  useEffect(() => {
    if (colorId && colorDetail && !isLoadingColorDetail) {
      reset({
        name: colorDetail.name,
        hexCode: colorDetail.hexCode,
      });
    } else if (!colorId) {
      reset({name: "", hexCode: ""});
    }
  }, [colorId, colorDetail, isLoadingColorDetail, reset]);

  const onSubmit = async (data: ColorFormData) => {
    console.log("Submitting product data:", data);
    if (colorId) {
      updateColorMutation.mutate(data);
    } else {
      createColorMutation.mutate(data);
    }
  };
  const pageTitle = colorId ? "Cập nhật màu sắc" : "Tạo mới màu sắc";

  return (
    <Box className="max-w-2xl mx-auto p-4">
      <Typography variant="h5" className="font-bold mb-4">
        {pageTitle}
      </Typography>
      <div className="text-gray-500 text-sm">
        <div className="text-gray-400 text-sm flex mt-2">
          <span className="text-[#212B36]">Bảng điều khiển</span> <Tag />{" "}
          <span className="text-[#212B36]">Sản phẩm</span> <Tag /> {pageTitle}
        </div>
      </div>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Accordion defaultExpanded className="mb-4">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className="font-medium">Thông tin màu sắc</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Controller
              name="name"
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Tên màu"
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="hexCode"
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Mã màu (#RRGGBB)"
                  margin="normal"
                  error={!!errors.hexCode}
                  helperText={errors.hexCode?.message}
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
            onClick={() => changeTab && changeTab("listColor")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={
              createColorMutation.isLoading || updateColorMutation.isLoading
            }
          >
            {createColorMutation.isLoading || updateColorMutation.isLoading
              ? "Đang xử lý..."
              : colorId
              ? "Cập nhật"
              : "Tạo mới"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
