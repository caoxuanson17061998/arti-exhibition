/* eslint-disable */
import prisma from "../db";

export interface ProductInput {
  name: string;
  slug: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  ingredients: string;
  usage: string;
  burnTime: string;
  suitableFor: string;
  detailedSize: string;
  isCustomizable: boolean;
  thumbnailUrl?: string;
  imageUrls: string[];
  colorIds: string[];
  sizeIds: string[];
  categoryIds: string[];
}

// CREATE product
export async function createProduct(data: ProductInput) {
  try {
    const existing = await prisma.product.findUnique({
      where: {slug: data.slug},
    });

    if (existing) {
      return {success: false, error: "Slug already exists."};
    }

    const [validColorIds, validSizeIds, validCategoryIds] = await Promise.all([
      prisma.color.findMany({
        where: {id: {in: data.colorIds}},
        select: {id: true},
      }),
      prisma.size.findMany({
        where: {id: {in: data.sizeIds}},
        select: {id: true},
      }),
      prisma.category.findMany({
        where: {id: {in: data.categoryIds}},
        select: {id: true},
      }),
    ]);

    const productData: any = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      originalPrice: data.originalPrice,
      salePrice: data.salePrice,
      ingredients: data.ingredients,
      usage: data.usage,
      burnTime: data.burnTime,
      suitableFor: data.suitableFor,
      detailedSize: data.detailedSize,
      isCustomizable: data.isCustomizable,
      thumbnailUrl: data.thumbnailUrl,
      imageUrls: data.imageUrls,
    };

    if (validColorIds.length > 0) {
      productData.colors = {
        create: validColorIds.map((c: {id: any}) => ({
          color: {connect: {id: c.id}},
        })),
      };
    }

    if (validSizeIds.length > 0) {
      productData.sizes = {
        create: validSizeIds.map((s: {id: string}) => ({
          size: {connect: {id: s.id}},
        })),
      };
    }

    if (validCategoryIds.length > 0) {
      productData.categories = {
        create: validCategoryIds.map((cat: {id: any}) => ({
          category: {connect: {id: cat.id}},
        })),
      };
    }

    const product = await prisma.product.create({
      data: productData,
      include: {
        colors: {include: {color: true}},
        sizes: {include: {size: true}},
        categories: {include: {category: true}},
      },
    });

    return {success: true, data: product};
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

// UPDATE product
export async function updateProduct(id: string, data: ProductInput) {
  try {
    const existing = await prisma.product.findUnique({where: {id}});
    if (!existing) return {success: false, error: "Product not found."};

    const slugTaken = await prisma.product.findFirst({
      where: {slug: data.slug, NOT: {id}},
    });
    if (slugTaken) return {success: false, error: "Slug already exists."};

    const updated = await prisma.product.update({
      where: {id},
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        originalPrice: data.originalPrice,
        salePrice: data.salePrice,
        ingredients: data.ingredients,
        usage: data.usage,
        burnTime: data.burnTime,
        suitableFor: data.suitableFor,
        detailedSize: data.detailedSize,
        isCustomizable: data.isCustomizable,
        thumbnailUrl: data.thumbnailUrl,
        imageUrls: data.imageUrls,
        colors: {
          deleteMany: {},
          create: data.colorIds.map((colorId) => ({
            color: {connect: {id: colorId}},
          })),
        },
        sizes: {
          deleteMany: {},
          create: data.sizeIds.map((sizeId: string) => ({
            size: {connect: {id: sizeId}},
          })),
        },
        categories: {
          deleteMany: {},
          create: data.categoryIds.map((categoryId) => ({
            category: {connect: {id: categoryId}},
          })),
        },
      },
      include: {
        colors: {include: {color: true}},
        sizes: {include: {size: true}},
        categories: {include: {category: true}},
      },
    });

    return {success: true, data: updated};
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update product",
    };
  }
}

// GET product by ID
export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {id},
      include: {
        colors: {include: {color: true}},
        sizes: {include: {size: true}},
        categories: {include: {category: true}},
      },
    });

    if (!product) return {success: false, error: "Product not found"};

    return {success: true, data: product};
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch product",
    };
  }
}

// GET all products with filter + sort
export async function getProducts(filters?: {
  colorIds?: string[];
  sizeIds?: string[];
  categoryIds?: string[];
  sortBy?: "createdAt" | "originalPrice" | "salePrice";
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
}) {
  try {
    const where: any = {};

    if (filters?.colorIds?.length) {
      where.colors = {
        some: {colorId: {in: filters.colorIds}},
      };
    }

    if (filters?.sizeIds?.length) {
      where.sizes = {
        some: {sizeId: {in: filters.sizeIds}},
      };
    }

    if (filters?.categoryIds?.length) {
      where.categories = {
        some: {categoryId: {in: filters.categoryIds}},
      };
    }

    if (
      typeof filters?.minPrice === "number" ||
      typeof filters?.maxPrice === "number"
    ) {
      where.salePrice = {};
      if (typeof filters.minPrice === "number") {
        where.salePrice.gte = filters.minPrice;
      }
      if (typeof filters.maxPrice === "number") {
        where.salePrice.lte = filters.maxPrice;
      }
    }

    const products = await prisma.product.findMany({
      where,
      orderBy:
        filters?.sortBy &&
        ["createdAt", "originalPrice", "salePrice"].includes(filters.sortBy)
          ? {[filters.sortBy]: filters.sortOrder === "asc" ? "asc" : "desc"}
          : {createdAt: "desc"},
      include: {
        colors: {include: {color: true}},
        sizes: {include: {size: true}},
        categories: {include: {category: true}},
      },
    });

    return {success: true, data: products};
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch products",
    };
  }
}

// DELETE product
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({where: {id}});
    return {success: true};
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}
