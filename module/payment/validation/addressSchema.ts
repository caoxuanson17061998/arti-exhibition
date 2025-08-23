import * as yup from "yup";

export const addressValidationSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Vui lòng nhập họ tên")
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(50, "Họ tên không được quá 50 ký tự"),

  phone: yup
    .string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),

  country: yup.string().required("Vui lòng chọn quốc gia"),

  address: yup
    .string()
    .required("Vui lòng nhập địa chỉ chi tiết")
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự")
    .max(200, "Địa chỉ không được quá 200 ký tự"),

  isDefault: yup.boolean().default(false),
});

export type Address2FormData = yup.InferType<typeof addressValidationSchema>;
