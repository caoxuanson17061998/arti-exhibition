import prisma from "../db";
import {ensureCustomProductData} from "./seed-data";

export interface CustomProductData {
  selectedColor: string;
  selectedScents: string[];
  title: string;
  logoSize: "S" | "M" | "L";
  uploadedImage?: string | null;
  quantity: number;
  userId?: string;
}

export interface CustomProductCreateData {
  name: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  colorId: string;
  scentIds: string[];
  customization: {
    title: string;
    logoSize: string;
    uploadedImage?: string;
  };
  quantity: number;
}

// Get base custom candle product (or create it if it doesn't exist)
export async function getOrCreateBaseCustomProduct() {
  try {
    // Ensure data exists before operations
    await ensureCustomProductData();

    // Check if base custom product exists
    let baseProduct = await prisma.product.findFirst({
      where: {
        slug: "custom-candle-base",
        isCustomizable: true,
      },
      include: {
        colors: {include: {color: true}},
        scents: {include: {scent: true}},
        categories: {include: {category: true}},
      },
    });

    // Create base product if it doesn't exist
    if (!baseProduct) {
      // Get all available colors and scents for the base product
      const [colors, scents, categories] = await Promise.all([
        prisma.color.findMany(),
        prisma.scent.findMany(),
        prisma.category.findMany(),
      ]);

      baseProduct = await prisma.product.create({
        data: {
          name: "Nến Thơm Tùy Chỉnh",
          slug: "custom-candle-base",
          description:
            "Nến thơm được thiết kế theo ý tưởng của bạn với màu sắc, mùi hương và nhãn tùy chỉnh.",
          originalPrice: 299000,
          salePrice: 320000,
          ingredients: "Sáp đậu nành tự nhiên, tinh dầu thơm cao cấp",
          usage:
            "Thắp sáng trong không gian yêu thích, thời gian đốt tối đa 4 giờ mỗi lần",
          burnTime: "35-40 giờ",
          suitableFor: "Phòng khách, phòng ngủ, văn phòng",
          detailedScent: "Mùi hương được tùy chỉnh theo lựa chọn của bạn",
          isCustomizable: true,
          size: "MEDIUM",
          thumbnailUrl: "/img/your-design/candle-nude.jpg",
          imageUrls: [
            "/img/your-design/candle-nude.jpg",
            "/img/your-design/candle-blue.jpg",
            "/img/your-design/candle-pink.jpg",
            "/img/your-design/candle-green.jpg",
            "/img/your-design/candle-black.jpg",
            "/img/your-design/candle-white.jpg",
          ],
          colors: {
            create: colors.map((color: any) => ({
              color: {connect: {id: color.id}},
            })),
          },
          scents: {
            create: scents.map((scent: any) => ({
              scent: {connect: {id: scent.id}},
            })),
          },
          categories: {
            create:
              categories.length > 0
                ? [
                    {
                      category: {connect: {id: categories[0].id}},
                    },
                  ]
                : [],
          },
        },
        include: {
          colors: {include: {color: true}},
          scents: {include: {scent: true}},
          categories: {include: {category: true}},
        },
      });
    }

    return {success: true, data: baseProduct};
  } catch (error) {
    console.error("Error getting/creating base custom product:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to get base custom product",
    };
  }
}

// Get all available colors and scents for customization
export async function getCustomizationOptions() {
  try {
    // Ensure data exists before fetching
    await ensureCustomProductData();

    const [colors, scents] = await Promise.all([
      prisma.color.findMany({
        orderBy: {name: "asc"},
      }),
      prisma.scent.findMany({
        orderBy: {name: "asc"},
      }),
    ]);

    return {
      success: true,
      data: {
        colors,
        scents,
      },
    };
  } catch (error) {
    console.error("Error fetching customization options:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch customization options",
    };
  }
}

// Create a unique custom product for the cart
export async function createCustomProductVariant(
  data: CustomProductCreateData,
) {
  try {
    // Get the base custom product
    const baseProductResult = await getOrCreateBaseCustomProduct();
    if (!baseProductResult.success || !baseProductResult.data) {
      return {success: false, error: "Failed to get base product"};
    }

    const baseProduct = baseProductResult.data;

    // Validate color exists
    const color = await prisma.color.findUnique({
      where: {id: data.colorId},
    });
    if (!color) {
      return {success: false, error: "Invalid color selected"};
    }

    // Validate scents exist
    const scents = await prisma.scent.findMany({
      where: {id: {in: data.scentIds}},
    });
    if (scents.length !== data.scentIds.length) {
      return {success: false, error: "Invalid scents selected"};
    }

    // Create unique slug for this custom variant
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const customSlug = `custom-candle-${timestamp}-${randomId}`;

    // Get the appropriate color image
    const colorImageMap: Record<string, string> = {
      nude: "/img/your-design/candle-nude.jpg",
      blue: "/img/your-design/candle-blue.jpg",
      pink: "/img/your-design/candle-pink.jpg",
      green: "/img/your-design/candle-green.jpg",
      black: "/img/your-design/candle-black.jpg",
      white: "/img/your-design/candle-white.jpg",
    };

    const colorKey = color.name.toLowerCase();
    const thumbnailUrl = colorImageMap[colorKey] || colorImageMap.nude;

    // Create the custom product variant
    const customProduct = await prisma.product.create({
      data: {
        name: data.name,
        slug: customSlug,
        description: data.description,
        originalPrice: data.originalPrice,
        salePrice: data.salePrice,
        ingredients: baseProduct.ingredients,
        usage: baseProduct.usage,
        burnTime: baseProduct.burnTime,
        suitableFor: baseProduct.suitableFor,
        detailedScent: `Mùi hương tùy chỉnh: ${scents
          .map((s: {name: any}) => s.name)
          .join(", ")}`,
        isCustomizable: true,
        size: baseProduct.size,
        thumbnailUrl,
        imageUrls: [thumbnailUrl],
        colors: {
          create: [{color: {connect: {id: data.colorId}}}],
        },
        scents: {
          create: data.scentIds.map((scentId) => ({
            scent: {connect: {id: scentId}},
          })),
        },
        categories: {
          create: baseProduct.categories.map((cat: {category: {id: any}}) => ({
            category: {connect: {id: cat.category.id}},
          })),
        },
      },
      include: {
        colors: {include: {color: true}},
        scents: {include: {scent: true}},
        categories: {include: {category: true}},
      },
    });

    return {success: true, data: customProduct};
  } catch (error) {
    console.error("Error creating custom product variant:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create custom product",
    };
  }
}

// Convert color constant to database color ID
export async function getColorByName(colorName: string) {
  try {
    const colorMap: Record<string, string> = {
      nude: "Nude",
      blue: "Xanh dương",
      pink: "Hồng",
      green: "Xanh lục",
      black: "Đen",
      white: "Trắng",
    };

    const dbColorName = colorMap[colorName.toLowerCase()] || colorName;

    const color = await prisma.color.findFirst({
      where: {
        name: {
          contains: dbColorName,
          mode: "insensitive",
        },
      },
    });

    return color;
  } catch (error) {
    console.error("Error finding color:", error);
    return null;
  }
}

// Convert scent names to database scent IDs
export async function getScentsByNames(scentNames: string[]) {
  try {
    const scents = await prisma.scent.findMany({
      where: {
        name: {
          in: scentNames,
        },
      },
    });

    return scents;
  } catch (error) {
    console.error("Error finding scents:", error);
    return [];
  }
}
