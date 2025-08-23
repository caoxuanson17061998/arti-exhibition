import {
  type ProductInput,
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "@utils/actions/product-actions";
import type {NextApiRequest, NextApiResponse} from "next";

function isStringArray(arr: unknown): arr is string[] {
  return Array.isArray(arr) && arr.every((item) => typeof item === "string");
}

function validateAndTransformProductBody(
  body: unknown,
): ProductInput | {error: string} {
  if (typeof body !== "object" || body === null) {
    return {error: "Invalid request body"};
  }

  const b = body as Record<string, unknown>;

  const requiredFields = [
    "name",
    "slug",
    "description",
    "originalPrice",
    "salePrice",
    "ingredients",
    "usage",
    "burnTime",
    "suitableFor",
    "detailedSize",
    "imageUrls",
    "colorIds",
    "sizeIds",
    "categoryIds",
  ];

  for (const field of requiredFields) {
    if (!(field in b)) {
      return {error: `Missing field: ${field}`};
    }
  }

  if (typeof b.detailedSize !== "string" || b.detailedSize.length === 0) {
    return {error: "Invalid or missing detailedSize value"};
  }

  if (
    !isStringArray(b.imageUrls) ||
    !isStringArray(b.colorIds) ||
    !isStringArray(b.sizeIds) ||
    !isStringArray(b.categoryIds)
  ) {
    return {
      error:
        "imageUrls, colorIds, sizeIds, and categoryIds must be arrays of strings",
    };
  }

  return {
    name: String(b.name),
    slug: String(b.slug),
    description: String(b.description),
    originalPrice: Number(b.originalPrice),
    salePrice: Number(b.salePrice),
    ingredients: String(b.ingredients),
    usage: String(b.usage),
    burnTime: String(b.burnTime),
    suitableFor: String(b.suitableFor),
    detailedSize: String(b.detailedSize),
    isCustomizable: Boolean(b.isCustomizable),
    thumbnailUrl:
      typeof b.thumbnailUrl === "string" ? b.thumbnailUrl : undefined,
    imageUrls: b.imageUrls,
    colorIds: b.colorIds,
    sizeIds: b.sizeIds,
    categoryIds: b.categoryIds,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method) {
      case "GET": {
        const {
          id,
          colorId,
          categoryId,
          sortBy,
          sortOrder,
          size,
          minPrice,
          maxPrice,
        } = req.query;

        if (id && typeof id === "string") {
          const result = await getProductById(id);
          return result.success
            ? res.status(200).json(result.data)
            : res.status(404).json({error: result.error});
        }

        const colorIds = colorId
          ? Array.isArray(colorId)
            ? colorId
            : [colorId]
          : undefined;

        const categoryIds = categoryId
          ? Array.isArray(categoryId)
            ? categoryId
            : [categoryId]
          : undefined;

        const allowedSortBy = [
          "createdAt",
          "originalPrice",
          "salePrice",
        ] as const;
        const validSortBy =
          typeof sortBy === "string" && allowedSortBy.includes(sortBy as any)
            ? (sortBy as (typeof allowedSortBy)[number])
            : undefined;

        const validSortOrder =
          typeof sortOrder === "string" &&
          (sortOrder === "asc" || sortOrder === "desc")
            ? (sortOrder as "asc" | "desc")
            : undefined;

        let sizeFilter: string[] | undefined;
        if (size) {
          if (Array.isArray(size)) {
            sizeFilter = size;
          } else {
            sizeFilter = [size];
          }
        }

        const minPriceNum =
          typeof minPrice === "string" ? Number(minPrice) : undefined;
        const maxPriceNum =
          typeof maxPrice === "string" ? Number(maxPrice) : undefined;

        const result = await getProducts({
          colorIds,
          categoryIds,
          sortBy: validSortBy,
          sortOrder: validSortOrder,
          sizeIds: sizeFilter,
          minPrice: minPriceNum,
          maxPrice: maxPriceNum,
        });

        return result.success
          ? res.status(200).json(result.data)
          : res.status(500).json({error: result.error});
      }

      case "POST": {
        const data = validateAndTransformProductBody(req.body);
        if ("error" in data) {
          return res.status(400).json({error: data.error});
        }

        const result = await createProduct(data);
        return result.success
          ? res.status(201).json(result.data)
          : res.status(500).json({error: result.error});
      }

      case "PUT": {
        const {id} = req.query;
        if (!id || typeof id !== "string") {
          return res.status(400).json({error: "ID is required for update"});
        }

        const data = validateAndTransformProductBody(req.body);
        if ("error" in data) {
          return res.status(400).json({error: data.error});
        }

        const result = await updateProduct(id, data);
        return result.success
          ? res.status(200).json(result.data)
          : res
              .status(result.error === "Product not found." ? 404 : 500)
              .json({error: result.error});
      }

      case "DELETE": {
        const {id} = req.query;
        if (!id || typeof id !== "string") {
          return res.status(400).json({error: "ID is required for delete"});
        }

        const result = await deleteProduct(id);
        return result.success
          ? res.status(200).json({message: "Product deleted successfully"})
          : res
              .status(result.error === "Product not found." ? 404 : 500)
              .json({error: result.error});
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res
          .status(405)
          .json({error: `Method ${req.method} Not Allowed`});
    }
  } catch (error) {
    return res.status(500).json({error: "Internal Server Error"});
  }
}
