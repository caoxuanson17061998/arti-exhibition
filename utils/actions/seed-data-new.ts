/* eslint-disable no-await-in-loop */
import prisma from "../db";

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
          name: "Nến thơm cao cấp",
          description: "Dòng nến thơm premium với chất lượng vượt trội",
        },
        {
          name: "Nến thơm handmade",
          description: "Nến thơm thủ công, độc đáo và tinh tế",
        },
        {
          name: "Nến thơm trang trí",
          description: "Nến vừa thơm vừa đẹp, phù hợp trang trí",
        },
        {name: "Nến massage", description: "Nến có thể tan thành dầu massage"},
        {name: "Nến thơm mini", description: "Kích thước nhỏ gọn, tiện lợi"},
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
          description: "Kích thước nhỏ (8cm x 10cm)",
        },
        {
          name: "MEDIUM",
          description: "Kích thước trung bình (12cm x 15cm)",
        },
        {
          name: "LARGE",
          description: "Kích thước lớn (18cm x 20cm)",
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

      const suitableForOptions = [
        "Phòng khách, phòng ngủ, văn phòng",
        "Phòng ăn, hành lang, cầu thang",
        "Spa, salon, phòng thiền",
        "Khách sạn, resort, nhà hàng",
        "Studio, gallery, showroom",
        "Phòng làm việc, thư viện",
        "Phòng trẻ em, phòng học",
        "Phòng tắm, ban công, sân vườn",
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
          ingredients: "Canvas cao cấp, mực in chống UV, khung gỗ tự nhiên",
          usage: "Treo tường trong nhà, tránh ánh nắng trực tiếp",
          burnTime: `Bền màu ${Math.floor(Math.random() * 20) + 10}-${
            Math.floor(Math.random() * 20) + 30
          } năm`,
          suitableFor: suitableForOptions[i % suitableForOptions.length],
          detailedSize: `${
            [
              "8cm x 10cm",
              "10cm x 12cm",
              "12cm x 15cm",
              "15cm x 18cm",
              "18cm x 20cm",
            ][i % 5]
          } - Phong cách ${
            ["hiện đại", "cổ điển", "tối giản", "nghệ thuật", "trừu tượng"][
              i % 5
            ]
          }`,
          isCustomizable: Math.random() > 0.6, // 40% customizable
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
        adminUser = await prisma.user.create({
          data: {
            email: "admin@gmail.com",
            name: "Admin",
            password: "Admin@123", // password: "password"
            role: "admin",
          },
        });
      }

      const postTitles = [
        "Lợi ích của nến thơm đối với sức khỏe tinh thần",
        "Cách chọn nến thơm phù hợp cho từng không gian",
        "Hướng dẫn bảo quản nến thơm đúng cách",
        "Top 10 hương thơm được yêu thích nhất năm 2024",
        "Nghệ thuật trang trí với nến thơm trong nhà",
        "Nến thơm và phong thủy: Tạo năng lượng tích cực",
        "DIY: Làm nến thơm tại nhà đơn giản",
        "Lịch sử và văn hóa nến thơm qua các thời đại",
        "Aromatherapy: Liệu pháp hương thơm hiện đại",
        "Nến thơm cho spa tại nhà: Bí quyết thư giãn",
        "Tác động của màu sắc nến lên tâm trạng",
        "Cách phối hợp hương thơm cho từng mùa",
        "Nến thơm organic: Xu hướng xanh cho gia đình",
        "Bí mật của việc pha chế hương thơm độc đáo",
        "Nến thơm trong các dịp lễ và sự kiện đặc biệt",
        "Yoga và thiền với nến thơm: Hành trình tĩnh lặng",
        "Cách tạo không gian lãng mạn với nến thơm",
        "Nến thơm và giấc ngủ: Chìa khóa của đêm yên bình",
        "Khoa học đằng sau tác dụng của hương thơm",
        "Nến thơm handmade vs công nghiệp: Ưu nhược điểm",
        "Cách đọc nhãn nến thơm để chọn sản phẩm tốt",
        "Nến thơm trong văn hóa Việt Nam",
        "Trang trí bàn ăn với nến thơm cho bữa tiệc",
        "Nến thơm và tâm lý học màu sắc",
        "Hướng dẫn thắp nến an toàn tại nhà",
        "Nến thơm cho trẻ em: Lưu ý và khuyến nghị",
        "Tác động của hương thơm lên trí nhớ",
        "Nến thơm trong thiết kế nội thất hiện đại",
        "Cách kết hợp nến thơm với âm nhạc thư giãn",
        "Nến thơm mùa đông: Ấm áp cho ngôi nhà",
        "Nến thơm mùa xuân: Tươi mới và sống động",
        "Nến thơm mùa hè: Mát mẻ và tươi sáng",
        "Nến thơm mùa thu: Ấm cúng và lãng mạn",
        "Phong cách Scandinavian với nến thơm tối giản",
        "Nến thơm trong phong cách Bohemian",
        "Cách chăm sóc da bằng nến massage thơm",
        "Nến thơm và meditation: Kết nối tâm linh",
        "Tác dụng của nến thơm lên hormone hạnh phúc",
        "Nến thơm trong cafe và nhà hàng",
        "Cách tái chế nến thơm đã cháy hết",
        "Nến thơm luxury: Đẳng cấp trong từng chi tiết",
        "Hương thơm thiên nhiên vs tổng hợp",
        "Nến thơm cho người có làn da nhạy cảm",
        "Cách tạo signature scent cho gia đình",
        "Nến thơm trong trị liệu căng thẳng",
        "Phong thủy và vị trí đặt nến trong nhà",
        "Nến thơm cho workout tại nhà",
        "Cách chọn nến thơm cho phòng tắm",
        "Nến thơm và tác động lên giấc mơ",
        "Xu hướng nến thơm năm 2024",
      ];

      const descriptions = [
        "Khám phá những tác động tích cực của nến thơm lên tâm trạng và sức khỏe tinh thần",
        "Hướng dẫn chi tiết cách lựa chọn nến thơm phù hợp với từng không gian sống",
        "Những bí quyết để nến thơm của bạn luôn giữ được chất lượng tốt nhất",
        "Cập nhật những xu hướng hương thơm hot nhất được ưa chuộng hiện nay",
        "Biến ngôi nhà thành gallery nghệ thuật với nến thơm sang trọng",
        "Ứng dụng nguyên lý phong thủy để tạo không gian sống hài hòa",
        "Hướng dẫn từng bước tạo ra nến thơm độc đáo tại nhà",
        "Hành trình khám phá di sản văn hóa nến thơm qua nhiều thế kỷ",
        "Tìm hiểu về liệu pháp hương thơm và ứng dụng trong cuộc sống",
        "Tạo không gian thư giãn như spa ngay tại nhà với nến thơm",
      ];

      const blogImages = [
        "/img/blog/candle-wellness.jpg",
        "/img/blog/home-decoration.jpg",
        "/img/blog/aromatherapy.jpg",
        "/img/blog/spa-relaxation.jpg",
        "/img/blog/meditation.jpg",
        "/img/blog/romantic-dinner.jpg",
        "/img/blog/modern-interior.jpg",
        "/img/blog/seasonal-decor.jpg",
        "/img/products/product-1.png",
        "/img/products/product-2.png",
        "/img/products/product-3.png",
        "/img/home/candles/candle-1.svg",
        "/img/home/candles/candle-2.svg",
        "/img/home/candles/candle-3.svg",
      ];

      const contentTemplates = [
        `<h2>Khám phá thế giới nến thơm</h2>
         <p>Nến thơm không chỉ đơn thuần là vật dụng trang trí mà còn mang trong mình những giá trị sâu sắc về mặt tinh thần và sức khỏe.</p>
         <h3>Tác động tích cực</h3>
         <p>Những nghiên cứu khoa học đã chứng minh rằng hương thơm có thể ảnh hưởng trực tiếp đến tâm trạng và cảm xúc của con người.</p>
         <p>Việc sử dụng nến thơm đúng cách sẽ mang lại những lợi ích tuyệt vời cho cuộc sống hàng ngày của bạn.</p>`,

        `<h2>Bí quyết chọn lựa hoàn hảo</h2>
         <p>Để có được trải nghiệm tốt nhất với nến thơm, việc lựa chọn đúng sản phẩm phù hợp với nhu cầu là vô cùng quan trọng.</p>
         <h3>Những yếu tố cần xem xét</h3>
         <p>Từ chất liệu sáp, loại bấc đến hương thơm, mỗi chi tiết đều góp phần tạo nên chất lượng của sản phẩm.</p>
         <p>Hãy cùng tìm hiểu những tiêu chí quan trọng để có sự lựa chọn thông minh nhất.</p>`,

        `<h2>Nghệ thuật sống với hương thơm</h2>
         <p>Hương thơm có sức mạnh kỳ diệu trong việc tạo ra những khoảnh khắc đáng nhớ và cảm xúc sâu lắng.</p>
         <h3>Tạo không gian sống ý nghĩa</h3>
         <p>Mỗi hương thơm đều mang trong mình một câu chuyện riêng, một cảm xúc đặc biệt mà chỉ bạn mới có thể cảm nhận.</p>
         <p>Khám phá cách kết hợp hương thơm với không gian sống để tạo ra môi trường lý tưởng cho bản thân.</p>`,
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

    console.log("🕯️ Seeding products...");
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
