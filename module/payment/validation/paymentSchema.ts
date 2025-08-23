import * as yup from "yup";

export const paymentValidationSchema = yup.object().shape({
  shippingMethod: yup
    .string()
    .oneOf(["standard", "express"], "Vui lòng chọn phương thức vận chuyển")
    .required("Vui lòng chọn phương thức vận chuyển"),

  paymentMethod: yup
    .string()
    .oneOf(["cod", "online", "vietqr"], "Vui lòng chọn phương thức thanh toán")
    .required("Vui lòng chọn phương thức thanh toán"),
});

export type PaymentFormData = yup.InferType<typeof paymentValidationSchema>;
