import prisma from "../utils/db";

// Seed colors and sizes
async function seedColorsAndSizes() {
  try {
    // Seed colors
    const existingColors = await prisma.color.findMany();
    if (existingColors.length === 0) {
      const colors = [
        {name: "Trắng", hexCode: "#FFFFFF"},
        {name: "Đen", hexCode: "#000000"},
        {name: "Hồng", hexCode: "#FFB6C1"},
        {name: "Tím", hexCode: "#DDA0DD"},
        {name: "Xanh dương", hexCode: "#87CEEB"},
        {name: "Xanh lá", hexCode: "#90EE90"},
        {name: "Vàng", hexCode: "#FFFF99"},
        {name: "Cam", hexCode: "#FFA07A"},
        {name: "Đỏ", hexCode: "#FA8072"},
        {name: "Nâu", hexCode: "#D2B48C"},
        {name: "Xám", hexCode: "#808080"},
        {name: "Kem", hexCode: "#FFFDD0"},
        {name: "Bạc", hexCode: "#C0C0C0"},
        {name: "Vàng gold", hexCode: "#FFD700"},
        {name: "Xanh navy", hexCode: "#000080"},
      ];

      for (const color of colors) {
        await prisma.color.create({data: color});
      }
      console.log("✅ Successfully seeded colors");
    }

    // Seed sizes
    const existingSizes = await prisma.size.findMany();
    if (existingSizes.length === 0) {
      const sizes = [
        {
          name: "20x30cm",
          description: "Kích thước nhỏ - phù hợp không gian nhỏ, bàn làm việc",
        },
        {
          name: "30x40cm",
          description: "Kích thước trung bình - phù hợp phòng ngủ, hành lang",
        },
        {
          name: "40x60cm",
          description: "Kích thước lớn - phù hợp phòng khách, không gian rộng",
        },
        {
          name: "50x70cm",
          description: "Kích thước rất lớn - phù hợp sảnh lớn, phòng họp",
        },
        {name: "A4 (21x29.7cm)", description: "Kích thước tiêu chuẩn A4"},
        {name: "A3 (29.7x42cm)", description: "Kích thước tiêu chuẩn A3"},
        {
          name: "60x80cm",
          description:
            "Kích thước lớn panorama - phù hợp trang trí tường chính",
        },
        {name: "30x30cm", description: "Tranh vuông nhỏ - phong cách hiện đại"},
        {
          name: "40x40cm",
          description: "Tranh vuông trung - nổi bật trên tường",
        },
        {
          name: "50x50cm",
          description: "Tranh vuông lớn - điểm nhấn không gian",
        },
        {
          name: "60x20cm",
          description: "Kích thước ngang - phù hợp tranh phong cảnh",
        },
        {
          name: "80x120cm",
          description:
            "Kích thước siêu lớn - tạo điểm nhấn chính trong không gian",
        },
        {name: "A2 (42x59.4cm)", description: "Kích thước tiêu chuẩn A2"},
        {name: "A1 (59.4x84.1cm)", description: "Kích thước tiêu chuẩn A1"},
        {
          name: "Tùy chỉnh",
          description: "Kích thước tùy chỉnh theo yêu cầu khách hàng",
        },
      ];

      for (const size of sizes) {
        await prisma.size.create({data: size});
      }
      console.log("✅ Successfully seeded sizes");
    }

    // Seed categories
    const existingCategories = await prisma.category.findMany();
    if (existingCategories.length === 0) {
      const categories = [
        {
          name: "Tranh phong cảnh",
          description: "Tranh thiên nhiên, phong cảnh đẹp",
        },
        {
          name: "Tranh trừu tượng",
          description: "Tranh nghệ thuật hiện đại, trừu tượng",
        },
        {
          name: "Tranh chân dung",
          description: "Tranh vẽ người, chân dung nghệ thuật",
        },
        {
          name: "Tranh tĩnh vật",
          description: "Tranh vẽ đồ vật, hoa quả, vật dụng",
        },
        {
          name: "Tranh động vật",
          description: "Tranh vẽ các loài động vật đáng yêu",
        },
        {
          name: "Tranh tùy chỉnh",
          description: "Tranh được vẽ theo yêu cầu riêng",
        },
        {
          name: "Tranh minimalist",
          description: "Tranh phong cách tối giản, đơn giản",
        },
        {
          name: "Tranh vintage",
          description: "Tranh phong cách cổ điển, hoài cổ",
        },
        {
          name: "Tranh digital art",
          description: "Tranh nghệ thuật số hiện đại",
        },
        {name: "Tranh watercolor", description: "Tranh màu nước nghệ thuật"},
        {
          name: "Tranh oil painting",
          description: "Tranh sơn dầu chất lượng cao",
        },
        {
          name: "Tranh acrylic",
          description: "Tranh acrylic hiện đại và bền màu",
        },
        {
          name: "Tranh mandala",
          description: "Tranh mandala tâm linh, thiền định",
        },
        {
          name: "Tranh typography",
          description: "Tranh chữ nghệ thuật, quote truyền cảm hứng",
        },
        {name: "Tranh pop art", description: "Tranh phong cách pop art sặc sỡ"},
      ];

      for (const category of categories) {
        await prisma.category.create({data: category});
      }
      console.log("✅ Successfully seeded categories");
    }

    return {success: true};
  } catch (error) {
    console.error("❌ Error seeding colors and sizes:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to seed colors and sizes",
    };
  }
}

async function seedProducts() {
  try {
    const existingProducts = await prisma.product.findMany();

    if (existingProducts.length === 0) {
      // Get colors, sizes, and categories for relations
      const [colors, sizes, categories] = await Promise.all([
        prisma.color.findMany(),
        prisma.size.findMany(),
        prisma.category.findMany(),
      ]);

      // Tạo 100 sản phẩm
      console.log("🖼️ Creating 100 products...");

      for (let i = 0; i < 100; i++) {
        const productNumber = i + 1;
        const name = `Tranh Nghệ Thuật Số ${productNumber}`;
        const isOnSale = Math.random() > 0.7;
        const originalPrice = Math.floor(Math.random() * 500000) + 100000;
        const salePrice = isOnSale
          ? Math.floor(originalPrice * 0.8)
          : originalPrice;
        const rating = (Math.random() * 2 + 3).toFixed(1);
        const reviewCount = Math.floor(Math.random() * 100) + 1;

        const productData = {
          name,
          slug: `tranh-nghe-thuat-so-${productNumber}`,
          description: `Tác phẩm nghệ thuật tinh tế số ${productNumber}, mang đến vẻ đẹp tự nhiên cho không gian sống`,
          originalPrice,
          salePrice,
          rating: parseFloat(rating as string),
          reviewCount,
          isOnSale,
          ingredients: "Canvas cao cấp, mực in UV bền màu, khung gỗ tự nhiên",
          usage: "Treo tường trong nhà, tránh ánh nắng trực tiếp và độ ẩm cao",
          burnTime: `Bền màu ${Math.floor(Math.random() * 20) + 15}-${
            Math.floor(Math.random() * 20) + 35
          } năm`,
          suitableFor: "Phòng khách, phòng ngủ, văn phòng",
          detailedSize: "Phong cách hiện đại, thể hiện sự tinh tế",
          isCustomizable: Math.random() > 0.6,
          thumbnailUrl: "/img/products/product-1.png",
          imageUrls: [
            "/img/products/product-1.png",
            "/img/products/product-2.png",
          ],
        };

        const product = await prisma.product.create({
          data: productData,
        });

        // Add random color
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        await prisma.productColor.create({
          data: {
            productId: product.id,
            colorId: randomColor.id,
          },
        });

        // Add random size
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        await prisma.productSize.create({
          data: {
            productId: product.id,
            sizeId: randomSize.id,
          },
        });

        // Add random category
        const randomCategory =
          categories[Math.floor(Math.random() * categories.length)];
        await prisma.productCategory.create({
          data: {
            productId: product.id,
            categoryId: randomCategory.id,
          },
        });

        if ((i + 1) % 10 === 0) {
          console.log(`📦 Created ${i + 1}/100 products...`);
        }
      }

      console.log("✅ Successfully seeded 100 products");
    } else {
      console.log("⚠️ Products already exist, skipping seeding");
    }

    return {success: true};
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to seed products",
    };
  }
}

async function main() {
  console.log("🌱 Bắt đầu seed database...");

  try {
    console.log("🎨 Seeding colors, sizes, and categories...");
    const colorsResult = await seedColorsAndSizes();
    if (!colorsResult.success) {
      throw new Error(`Colors/Sizes seeding failed: ${colorsResult.error}`);
    }

    console.log("🖼️ Seeding products...");
    const productsResult = await seedProducts();
    if (!productsResult.success) {
      throw new Error(`Products seeding failed: ${productsResult.error}`);
    }

    console.log("🎉 All seeding completed successfully!");
    console.log("📊 Đã tạo:");
    console.log("   • 15 danh mục sản phẩm");
    console.log("   • 15 màu sắc");
    console.log("   • 15 kích thước");
    console.log("   • 100 sản phẩm tranh");
  } catch (error) {
    console.error("❌ Error in seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
