/* eslint-disable no-await-in-loop */
import prisma from "../db";
import bcrypt from "bcryptjs";

// Seed colors, categories and sizes first
export async function seedColorsAndCategories() {
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
      ];

      for (const color of colors) {
        await prisma.color.create({data: color});
      }
      console.log("✅ Successfully seeded colors");
    }

    // Seed categories
    const existingCategories = await prisma.category.findMany();
    if (existingCategories.length === 0) {
      const categories = [
        {
          name: "Tranh Phong Cảnh",
        },
        {
          name: "Tranh Trừu Tượng",
        },
        {
          name: "Tranh Hoa Lá",
        },
        {
          name: "Tranh Động Vật",
        },
        {
          name: "Tranh Chân Dung",
        },
        {
          name: "Tranh Minimalist",
        },
        {
          name: "Tranh Vintage",
        },
      ];

      for (const category of categories) {
        await prisma.category.create({data: category});
      }
      console.log("✅ Successfully seeded categories");
    }

    // Seed sizes
    const existingSizes = await prisma.size.findMany();
    if (existingSizes.length === 0) {
      const sizes = [
        {
          name: "SMALL",
          description: "Kích thước nhỏ (20cm x 30cm)",
        },
        {
          name: "MEDIUM",
          description: "Kích thước trung bình (40cm x 60cm)",
        },
        {
          name: "LARGE",
          description: "Kích thước lớn (60cm x 90cm)",
        },
        {
          name: "EXTRA_LARGE",
          description: "Kích thước siêu lớn (80cm x 120cm)",
        },
      ];

      for (const size of sizes) {
        await prisma.size.create({data: size});
      }
      console.log("✅ Successfully seeded sizes");
    }

    return {success: true};
  } catch (error) {
    console.error("❌ Error seeding colors, categories and sizes:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to seed colors, categories and sizes",
    };
  }
}

// Seed products with sample data
export async function seedProducts() {
  try {
    const existingProducts = await prisma.product.findMany();

    if (existingProducts.length === 0) {
      // Get colors, categories and sizes for relations
      const [colors, categories, sizes] = await Promise.all([
        prisma.color.findMany(),
        prisma.category.findMany(),
        prisma.size.findMany(),
      ]);

      const productNames = [
        "Tranh Lá Cây Xanh Nghệ Thuật",
        "Tranh Cảnh Thiên Nhiên Nghệ Thuật",
        "Tranh Hoa Trắng Nghệ Thuật",
        "Tranh Hoa Sen Nghệ Thuật",
        "Tranh Hoa Quả Trang Trí",
        "Tranh Lá Cây Vàng Gold Nghệ Thuật",
        "Tranh Thiên Nhiên Xanh Mát",
        "Tranh Hoa Hồng Lãng Mạn",
        "Tranh Cây Lá Vàng Mùa Thu",
        "Tranh Hoa Tulip Tươi Sáng",
        "Tranh Rừng Tre Xanh Mát",
        "Tranh Bình Minh Trên Núi",
        "Tranh Hoàng Hôn Trên Biển",
        "Tranh Hoa Anh Đào Nhật Bản",
        "Tranh Cánh Đồng Hoa Hướng Dương",
        "Tranh Vườn Hoa Lavender Tím",
        "Tranh Thác Nước Trong Rừng",
        "Tranh Cây Cổ Thụ Nghìn Năm",
        "Tranh Hoa Dạ Lan Hương",
        "Tranh Cánh Đồng Lúa Vàng",
        "Tranh Trừu Tượng Màu Pastel",
        "Tranh Geometric Hiện Đại",
        "Tranh Minimalist Đen Trắng",
        "Tranh Watercolor Nghệ Thuật",
        "Tranh Oil Painting Cổ Điển",
        "Tranh Digital Art Tương Lai",
        "Tranh Mandala Tâm Linh",
        "Tranh Typography Nghệ Thuật",
        "Tranh Pattern Bohemian",
        "Tranh Mixed Media Sáng Tạo",
        "Tranh Mùa Xuân Hoa Nở",
        "Tranh Mùa Hè Tràn Năng Lượng",
        "Tranh Mùa Thu Lá Vàng",
        "Tranh Mùa Đông Tuyết Trắng",
        "Tranh Tết Nguyên Đán Truyền Thống",
        "Tranh Halloween Bí Ẩn",
        "Tranh Giáng Sinh Ấm Áp",
        "Tranh Valentine Tình Yêu",
        "Tranh Phụ Nữ Ngày 8/3",
        "Tranh Gia Đình Hạnh Phúc",
        "Tranh Chim Hót Trên Cành",
        "Tranh Bươm Bướm Sặc Sỡ",
        "Tranh Cá Koi Nhật Bản",
        "Tranh Hươu Rừng Dịu Dàng",
        "Tranh Mèo Dễ Thương",
        "Tranh Chó Golden Retriever",
        "Tranh Ngựa Hoang Dã",
        "Tranh Đại Bàng Uy Nghiêm",
        "Tranh Cú Mèo Thông Thái",
        "Tranh Heo Con Hồng Hào",
      ];

      const descriptions = [
        "Tác phẩm nghệ thuật tinh tế, mang đến vẻ đẹp tự nhiên cho không gian sống",
        "Bức tranh được thiết kế tỉ mỉ, phù hợp để trang trí phòng khách sang trọng",
        "Nghệ thuật đương đại với màu sắc hài hòa, tạo điểm nhấn cho căn phòng",
        "Sản phẩm trang trí cao cấp, thể hiện gu thẩm mỹ tinh tế của gia chủ",
        "Tranh nghệ thuật chất lượng cao, in trên giấy canvas bền đẹp",
        "Tác phẩm độc đáo, kết hợp giữa nghệ thuật truyền thống và hiện đại",
        "Bức tranh mang phong cách minimalist, phù hợp với nội thất hiện đại",
        "Nghệ thuật trang trí sang trọng, tạo không gian sống đẳng cấp",
        "Tranh có khung cao cấp, sẵn sàng để treo ngay khi nhận hàng",
        "Sản phẩm handmade tinh xảo, từng chi tiết được chăm chút kỹ lưỡng",
      ];

      const imageUrls = [
        "/img/products/product-1.png",
        "/img/products/product-2.png",
        "/img/products/product-3.png",
        "/img/products/product-4.png",
        "/img/products/product-5.png",
        "/img/products/product-6.png",
        "/img/home/candles/candle-1.svg",
        "/img/home/candles/candle-2.svg",
        "/img/home/candles/candle-3.svg",
        "/img/home/candles/candle-4.svg",
        "/img/home/candles/candle-5.svg",
        "/img/home/candles/candle-6.svg",
        "/img/home/candles/candle-7.svg",
        "/img/home/candles/candle-8.svg",
      ];

      const products = [];
      for (let i = 0; i < 50; i++) {
        const name = productNames[i];
        const isOnSale = Math.random() > 0.7; // 30% chance of sale
        const originalPrice = Math.floor(Math.random() * 500000) + 100000; // 100k-600k
        const salePrice = isOnSale
          ? Math.floor(originalPrice * 0.8)
          : originalPrice;
        const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0-5.0
        const reviewCount = Math.floor(Math.random() * 100) + 1;
        const imageIndex = i % imageUrls.length;

        products.push({
          name,
          slug: name
            .toLowerCase()
            .replace(/tranh /g, "")
            .replace(/nghệ thuật/g, "nghe-thuat")
            .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
            .replace(/[èéẹẻẽêềếệểễ]/g, "e")
            .replace(/[ìíịỉĩ]/g, "i")
            .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
            .replace(/[ùúụủũưừứựửữ]/g, "u")
            .replace(/[ỳýỵỷỹ]/g, "y")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, ""),
          description: descriptions[i % descriptions.length],
          originalPrice,
          salePrice,
          rating: parseFloat(rating as string),
          reviewCount,
          isOnSale,
          thumbnailUrl: imageUrls[imageIndex],
          imageUrls: [
            imageUrls[imageIndex],
            imageUrls[(imageIndex + 1) % imageUrls.length],
          ],
        });
      }

      // Create products and their relations
      for (const productData of products) {
        const product = await prisma.product.create({
          data: productData,
        });

        // Add color relations (random colors for each product)
        const randomColors = colors.slice(0, Math.floor(Math.random() * 3) + 1);
        for (const color of randomColors) {
          await prisma.productColor.create({
            data: {
              productId: product.id,
              colorId: color.id,
            },
          });
        }

        // Add size relation (random size)
        if (sizes.length > 0) {
          const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
          await prisma.productSize.create({
            data: {
              productId: product.id,
              sizeId: randomSize.id,
            },
          });
        }

        // Add category relation
        const randomCategory =
          categories[Math.floor(Math.random() * categories.length)];
        await prisma.productCategory.create({
          data: {
            productId: product.id,
            categoryId: randomCategory.id,
          },
        });
      }

      console.log(`✅ Successfully seeded ${products.length} products`);
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

// Seed posts with sample blog data
export async function seedPosts() {
  try {
    const existingPosts = await prisma.post.findMany();

    if (existingPosts.length === 0) {
      // First, create a sample admin user if not exists
      let adminUser = await prisma.user.findFirst({
        where: {role: "admin"},
      });

      if (!adminUser) {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        adminUser = await prisma.user.create({
          data: {
            email: "admin@gmail.com",
            name: "Admin",
            password: hashedPassword,
            role: "admin",
          },
        });
      }

      const postTitles = [
        "Cách chọn tranh trang trí phù hợp với không gian nhà",
        "Nghệ thuật treo tranh: Bí quyết tạo điểm nhấn cho tường",
        "Phong thủy và tranh trang trí: Tạo năng lượng tích cực",
        "Top 10 xu hướng tranh nghệ thuật được ưa chuộng 2024",
        "Cách bảo quản tranh canvas để giữ màu sắc bền đẹp",
        "Tranh trừu tượng: Hiểu và cảm nhận nghệ thuật hiện đại",
        "Tranh phong cảnh: Mang thiên nhiên vào không gian sống",
        "Cách phối màu tranh với nội thất để tạo hài hòa",
        "Tranh đen trắng: Sự tối giản đầy cuốn hút",
        "Nghệ thuật sắp xếp tranh theo từng phòng",
        "Tranh hoa lá: Tạo không gian tươi mới và sinh động",
        "Cách làm sạch và bảo dưỡng tranh canvas",
        "Tranh vintage: Nét cổ điển trong thiết kế hiện đại",
        "Tâm lý màu sắc trong tranh trang trí",
        "Cách chọn khung tranh phù hợp với từng tác phẩm",
        "Tranh động vật: Mang sự sống động vào ngôi nhà",
        "Gallery wall: Nghệ thuật trưng bày nhiều tranh",
        "Tranh cho phòng ngủ: Tạo không gian thư giãn",
        "Tranh minimalist: Vẻ đẹp của sự đơn giản",
        "Cách tạo điểm nhấn với tranh nghệ thuật lớn",
        "Tranh cho phòng khách: Thể hiện phong cách gia chủ",
        "Nghệ thuật kết hợp ánh sáng và tranh trang trí",
        "Tranh chân dung: Tôn vinh vẻ đẹp con người",
        "Cách chọn tranh phù hợp với màu tường",
        "Tranh 3D: Công nghệ mới trong nghệ thuật trang trí",
        "Tranh cho văn phòng: Tạo môi trường làm việc tích cực",
        "Lịch sử nghệ thuật hội họa qua các thời kỳ",
        "Tranh canvas vs tranh giấy: Ưu nhược điểm của từng loại",
        "Cách tạo bộ sưu tập tranh cá nhân",
        "Tranh theo phong cách Scandinavia",
        "Nghệ thuật mix & match tranh với đồ nội thất",
        "Tranh cho phòng ăn: Tạo không gian ấm cúng",
        "Cách đầu tư tranh nghệ thuật thông minh",
        "Tranh digital art: Xu hướng nghệ thuật số",
        "Tranh mandala: Nghệ thuật thiền và tĩnh lặng",
        "Cách trang trí cầu thang bằng tranh",
        "Tranh cho phòng tắm: Lưu ý đặc biệt về độ ẩm",
        "Nghệ thuật layering trong trang trí tranh",
        "Tranh theo mùa: Thay đổi không gian theo thời gian",
        "Cách chụp ảnh tranh để bán online hiệu quả",
        "Tranh handmade vs tranh in: Sự khác biệt chất lượng",
        "Tranh cho phòng trẻ em: An toàn và giáo dục",
        "Nghệ thuật storytelling qua tranh trang trí",
        "Tranh theo phong cách Bohemian",
        "Cách tự làm tranh DIY tại nhà",
        "Tranh theo phong cách Industrial",
        "Nghệ thuật cân bằng thị giác trong treo tranh",
        "Tranh panorama: Tạo cảm giác rộng mở",
        "Cách bảo vệ tranh khỏi ánh nắng mặt trời",
        "Xu hướng tranh nghệ thuật tương lai",
      ];

      const descriptions = [
        "Khám phá những nguyên tắc cơ bản để chọn tranh phù hợp với phong cách và không gian nhà bạn",
        "Hướng dẫn chi tiết về nghệ thuật treo tranh để tạo ra những điểm nhấn ấn tượng",
        "Những bí quyết để tranh của bạn luôn giữ được màu sắc tươi sáng qua thời gian",
        "Cập nhật những xu hướng tranh nghệ thuật hot nhất được ưa chuộng hiện nay",
        "Biến ngôi nhà thành gallery nghệ thuật với cách bố trí tranh khoa học",
        "Ứng dụng nguyên lý phong thủy để chọn và đặt tranh tạo năng lượng tích cực",
        "Hướng dẫn từng bước tạo ra những tác phẩm tranh độc đáo tại nhà",
        "Hành trình khám phá lịch sử nghệ thuật hội họa qua nhiều thế kỷ",
        "Tìm hiểu về tâm lý học màu sắc và ứng dụng trong trang trí nội thất",
        "Tạo không gian sống nghệ thuật và đẳng cấp với tranh trang trí",
      ];

      const blogImages = [
        "/img/blog/art-gallery.jpg",
        "/img/blog/home-decoration-art.jpg",
        "/img/blog/abstract-painting.jpg",
        "/img/blog/landscape-art.jpg",
        "/img/blog/modern-interior-art.jpg",
        "/img/blog/vintage-painting.jpg",
        "/img/blog/minimalist-art.jpg",
        "/img/blog/colorful-artwork.jpg",
        "/img/products/product-1.png",
        "/img/products/product-2.png",
        "/img/products/product-3.png",
        "/img/products/product-4.png",
        "/img/products/product-5.png",
        "/img/products/product-6.png",
      ];

      const contentTemplates = [
        `<h2>Nghệ thuật trang trí nội thất với tranh</h2>
         <p>Tranh không chỉ đơn thuần là vật dụng trang trí mà còn thể hiện phong cách và cá tính của gia chủ.</p>
         <h3>Tạo điểm nhấn cho không gian</h3>
         <p>Một bức tranh được lựa chọn và bố trí phù hợp có thể biến đổi hoàn toàn không gian sống của bạn.</p>
         <p>Việc hiểu rõ nguyên tắc phối màu và cân bằng thị giác sẽ giúp bạn tạo ra những góc nhà đẹp mắt.</p>`,

        `<h2>Bí quyết chọn tranh hoàn hảo</h2>
         <p>Để có được bức tranh phù hợp nhất với ngôi nhà, việc cân nhắc kỹ lưỡng về nhiều yếu tố là rất quan trọng.</p>
         <h3>Những yếu tố cần xem xét</h3>
         <p>Từ kích thước, màu sắc, chủ đề đến vị trí treo, mỗi chi tiết đều ảnh hưởng đến tổng thể không gian.</p>
         <p>Hãy cùng tìm hiểu những tiêu chí quan trọng để có sự lựa chọn thông minh và phù hợp nhất.</p>`,

        `<h2>Nghệ thuật sống cùng tranh trang trí</h2>
         <p>Tranh có sức mạnh kỳ diệu trong việc tạo ra cảm xúc và không khí đặc biệt cho ngôi nhà.</p>
         <h3>Tạo không gian sống có tâm hồn</h3>
         <p>Mỗi bức tranh đều kể một câu chuyện riêng, truyền tải một thông điệp đặc biệt đến người xem.</p>
         <p>Khám phá cách kết hợp tranh với ánh sáng và nội thất để tạo ra môi trường sống lý tưởng.</p>`,
      ];

      const posts = [];
      for (let i = 0; i < 50; i++) {
        const title = postTitles[i];
        const description = descriptions[i % descriptions.length];
        const content = contentTemplates[i % contentTemplates.length];
        const imageIndex = i % blogImages.length;
        const publishDate = new Date();
        publishDate.setDate(
          publishDate.getDate() - Math.floor(Math.random() * 365),
        ); // Random date within last year

        posts.push({
          title,
          description,
          content,
          image: blogImages[imageIndex],
          published: Math.random() > 0.1, // 90% published
          authorId: adminUser.id,
          createdAt: publishDate,
          updatedAt: publishDate,
        });
      }

      // Create all posts
      for (const postData of posts) {
        await prisma.post.create({
          data: postData,
        });
      }

      console.log(`✅ Successfully seeded ${posts.length} posts`);
    } else {
      console.log("⚠️ Posts already exist, skipping seeding");
    }

    return {success: true};
  } catch (error) {
    console.error("❌ Error seeding posts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to seed posts",
    };
  }
}

// Ensure custom product data is available (stub function)
export async function ensureCustomProductData() {
  try {
    // This function ensures basic data needed for custom products
    // For now, we'll just call the main seed functions if needed
    const [colors, categories, sizes] = await Promise.all([
      prisma.color.findMany(),
      prisma.category.findMany(),
      prisma.size.findMany(),
    ]);

    if (colors.length === 0 || categories.length === 0 || sizes.length === 0) {
      await seedColorsAndCategories();
    }

    return {success: true};
  } catch (error) {
    console.error("❌ Error ensuring custom product data:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to ensure custom product data",
    };
  }
}

// Seed all data in correct order
export async function seedAll() {
  try {
    console.log("🎨 Seeding colors, categories and sizes...");
    const colorsResult = await seedColorsAndCategories();
    if (!colorsResult.success) {
      return colorsResult;
    }

    console.log("�️ Seeding art products...");
    const productsResult = await seedProducts();
    if (!productsResult.success) {
      return productsResult;
    }

    console.log("📝 Seeding posts...");
    const postsResult = await seedPosts();
    if (!postsResult.success) {
      return postsResult;
    }

    return {success: true};
  } catch (error) {
    console.error("❌ Error seeding all data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to seed all data",
    };
  }
}
