import * as yup from "yup";

export const productSchema = yup.object({
  name: yup
    .string()
    .required("Tên sản phẩm là bắt buộc")
    .max(255, "Tên sản phẩm không được vượt quá 255 ký tự"),

  slug: yup.string().notRequired(),

  description: yup.string().default(""),

  originalPrice: yup
    .number()
    .default(0)
    .min(0, "Giá gốc phải lớn hơn hoặc bằng 0"),

  salePrice: yup.number().default(0).min(0, "Giá bán phải lớn hơn hoặc bằng 0"),

  thumbnailUrl: yup
    .string()
    .nullable()
    .transform((value) => value === null ? "" : value) // Convert null to empty string
    .test("is-valid-url", "Ảnh đại diện không hợp lệ", (value) => {
      if (!value || value === "" || value === null) return true; // Allow empty/null values
      // More flexible URL validation that accepts various formats
      const urlPattern = /^(https?:\/\/.+|blob:.+|data:image\/.+;base64,.+|\/.*\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$)/i;
      const result = urlPattern.test(value);
      return result;
    })
    .default(""),

  imageUrls: yup
    .array()
    .nullable()
    .transform((value) => value === null ? [] : value) // Convert null to empty array
    .of(
      yup
        .string()
        .nullable()
        .transform((value) => value === null ? "" : value) // Convert null to empty string
        .test("is-valid-url", "Ảnh trong danh sách không hợp lệ", (value) => {
          if (!value || value === "" || value === null) return true; // Allow empty/null values
          // More flexible URL validation that accepts various formats
          const urlPattern = /^(https?:\/\/.+|blob:.+|data:image\/.+;base64,.+|\/.*\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$)/i;
          const result = urlPattern.test(value);
          return result;
        }),
    )
    .default([]),

  colorIds: yup.array().of(yup.string()).default([]),
  sizeIds: yup.array().of(yup.string()).default([]),
  categoryIds: yup.array().of(yup.string()).default([]),
});

export type ProductFormData = yup.InferType<typeof productSchema>;
