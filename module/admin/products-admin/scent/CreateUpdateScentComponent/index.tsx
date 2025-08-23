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

interface CreateUpdateScentProps {
  changeTab?: (tab: string) => void;
  scentId?: string;
}

interface ApiError {
  error: string;
}

const schema = yup.object({
  name: yup
    .string()
    .required("Tên hương thơm là bắt buộc")
    .max(255, "Tên hương thơm không được vượt quá 255 ký tự"),
});
type ScentFormData = yup.InferType<typeof schema>;

export default function CreateUpdateScentComponent({
  changeTab,
  scentId,
}: CreateUpdateScentProps) {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    setError,
  } = useForm<ScentFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const {data: scentDetail, isLoading: isLoadingScentDetail} = useQuery(
    ["scentDetail", scentId],
    async () => {
      if (!scentId) return null;
      const res = await axios.get(`/api/scents?id=${scentId}`);
      return res.data;
    },
    {enabled: !!scentId},
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

  const createScentMutation = useMutation(
    async (data: ScentFormData) => {
      const res = await axios.post("/api/scents", data);
      return res.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("scents");
        if (changeTab) changeTab("listScent");
      },
      onError: handleApiError,
    },
  );

  const updateScentMutation = useMutation(
    async (data: ScentFormData) => {
      const res = await axios.put(`/api/scents?id=${scentId}`, data);
      return res.data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("scents");
        if (scentId)
          await queryClient.invalidateQueries(["scentDetail", scentId]);
        if (changeTab) changeTab("listScent");
      },
      onError: handleApiError,
    },
  );

  useEffect(() => {
    if (scentId && scentDetail && !isLoadingScentDetail) {
      reset({
        name: scentDetail.name,
      });
    } else if (!scentId) {
      reset({name: ""});
    }
  }, [scentId, scentDetail, isLoadingScentDetail, reset]);

  const onSubmit = async (data: ScentFormData) => {
    if (scentId) {
      updateScentMutation.mutate(data);
    } else {
      createScentMutation.mutate(data);
    }
  };
  const pageTitle = scentId ? "Cập nhật mùi hương" : "Thêm mới mùi hương";

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
              Thông tin mùi hương:
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
                  label="Tên mùi hương"
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
            onClick={() => changeTab && changeTab("listScent")}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={
              createScentMutation.isLoading || updateScentMutation.isLoading
            }
          >
            {createScentMutation.isLoading || updateScentMutation.isLoading
              ? "Đang xử lý..."
              : scentId
              ? "Cập nhật"
              : "Tạo mới"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
