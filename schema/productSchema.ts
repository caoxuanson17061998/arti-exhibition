import * as yup from "yup";

export const productSchema = yup.object({
  name: yup
    .string()
    .required("Tên sản phẩm là bắt buộc")
    .max(255, "Tên sản phẩm không được vượt quá 255 ký tự"),

  slug: yup.string().required("Slug là bắt buộc"),

  description: yup.string().default(""),

  originalPrice: yup
    .number()
    .default(0)
    .min(0, "Giá gốc phải lớn hơn hoặc bằng 0"),

  salePrice: yup.number().default(0).min(0, "Giá bán phải lớn hơn hoặc bằng 0"),

  isCharity: yup.boolean().default(false),

  thumbnailUrl: yup
    .string()
    .test("is-valid-url", "Ảnh đại diện không hợp lệ", (value) => {
      if (!value) return true;
      return /^https?:\/\/.+|^blob:|^data:image\/[a-z]+;base64,/.test(value);
    })
    .default(""),

  imageUrls: yup
    .array()
    .of(
      yup
        .string()
        .test("is-valid-url", "Ảnh trong danh sách không hợp lệ", (value) => {
          if (!value) return true;
          return /^https?:\/\/.+|^blob:|^data:image\/[a-z]+;base64,/.test(
            value,
          );
        }),
    )
    .default([]),

  colorIds: yup.array().of(yup.string()).default([]),
  sizeIds: yup.array().of(yup.string()).default([]),
  categoryIds: yup.array().of(yup.string()).default([]),
});

export type ProductFormData = yup.InferType<typeof productSchema>;
