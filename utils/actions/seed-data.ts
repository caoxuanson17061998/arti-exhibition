/* eslint-disable no-await-in-loop */
import prisma from "../db";

// Seed colors and sizes
export async function seedColorsAndSizes() {
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
        {name: "Tranh phong cảnh"},
        {name: "Tranh trừu tượng"},
        {name: "Tranh chân dung"},
        {name: "Tranh tĩnh vật"},
        {name: "Tranh động vật"},
        {name: "Tranh tùy chỉnh"},
        {name: "Tranh minimalist"},
        {name: "Tranh vintage"},
        {name: "Tranh digital art"},
        {name: "Tranh watercolor"},
        {name: "Tranh oil painting"},
        {name: "Tranh acrylic"},
        {name: "Tranh mandala"},
        {name: "Tranh typography"},
        {name: "Tranh pop art"},
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

// Seed products with sample data
export async function seedProducts() {
  try {
    const existingProducts = await prisma.product.findMany();

    if (existingProducts.length === 0) {
      // Get colors, sizes, and categories for relations
      const [colors, sizes, categories] = await Promise.all([
        prisma.color.findMany(),
        prisma.size.findMany(),
        prisma.category.findMany(),
      ]);

      const productNames = [
        // Tranh phong cảnh (20 sản phẩm)
        "Tranh Lá Cây Xanh Nghệ Thuật",
        "Tranh Cảnh Thiên Nhiên Nghệ Thuật",
        "Tranh Bình Minh Trên Núi",
        "Tranh Hoàng Hôn Trên Biển",
        "Tranh Thác Nước Trong Rừng",
        "Tranh Cây Cổ Thụ Nghìn Năm",
        "Tranh Cánh Đồng Lúa Vàng",
        "Tranh Rừng Tre Xanh Mát",
        "Tranh Cánh Đồng Hoa Hướng Dương",
        "Tranh Vườn Hoa Lavender Tím",
        "Tranh Núi Non Hùng Vĩ",
        "Tranh Sông Nước Miền Tây",
        "Tranh Bãi Biển Hoang Sơ",
        "Tranh Sa Mạc Bao La",
        "Tranh Rừng Mưa Nhiệt Đới",
        "Tranh Cầu Tre Nông Thôn",
        "Tranh Làng Quê Việt Nam",
        "Tranh Đồng Quê Mùa Gặt",
        "Tranh Mây Trời Xanh Ngắt",
        "Tranh Hồ Nước Trong Vắt",

        // Tranh hoa và tĩnh vật (20 sản phẩm)
        "Tranh Hoa Trắng Nghệ Thuật",
        "Tranh Hoa Sen Nghệ Thuật",
        "Tranh Hoa Quả Trang Trí",
        "Tranh Hoa Hồng Lãng Mạn",
        "Tranh Hoa Tulip Tươi Sáng",
        "Tranh Hoa Anh Đào Nhật Bản",
        "Tranh Hoa Dạ Lan Hương",
        "Tranh Hoa Cúc Họa Mi",
        "Tranh Hoa Ly Trắng Tinh Khôi",
        "Tranh Bình Hoa Cổ Điển",
        "Tranh Quả Táo Đỏ Tươi",
        "Tranh Lọ Hoa Gốm Sứ",
        "Tranh Hoa Đào Mùa Xuân",
        "Tranh Hoa Cẩm Chướng",
        "Tranh Bó Hoa Cưới",
        "Tranh Hoa Violet Tím",
        "Tranh Bình Trà Cổ",
        "Tranh Rượu Vang Sang Trọng",
        "Tranh Bánh Mì Pháp",
        "Tranh Tách Cà Phê Buổi Sáng",

        // Tranh trừu tượng và hiện đại (15 sản phẩm)
        "Tranh Trừu Tượng Màu Pastel",
        "Tranh Geometric Hiện Đại",
        "Tranh Minimalist Đen Trắng",
        "Tranh Digital Art Tương Lai",
        "Tranh Mandala Tâm Linh",
        "Tranh Typography Nghệ Thuật",
        "Tranh Pattern Bohemian",
        "Tranh Mixed Media Sáng Tạo",
        "Tranh Abstract Đỏ Cam",
        "Tranh Texture 3D Hiện Đại",
        "Tranh Gradient Màu Sắc",
        "Tranh Expressionism Cảm Xúc",
        "Tranh Surrealism Kỳ Ảo",
        "Tranh Cubism Phá Cách",
        "Tranh Impressionism Mềm Mại",

        // Tranh động vật (15 sản phẩm)
        "Tranh Chim Hót Trên Cành",
        "Tranh Bươm Bướm Sặc Sỡ",
        "Tranh Cá Koi Nhật Bản",
        "Tranh Hươu Rừng Dịu Dàng",
        "Tranh Mèo Dễ Thương",
        "Tranh Chó Golden Retriever",
        "Tranh Ngựa Hoang Dã",
        "Tranh Đại Bàng Uy Nghiêm",
        "Tranh Cú Mèo Thông Thái",
        "Tranh Hổ Rừng Săn Mồi",
        "Tranh Sư Tử Mạnh Mẽ",
        "Tranh Voi Con Tinh Nghịch",
        "Tranh Chim Én Mùa Xuân",
        "Tranh Cáo Đỏ Thông Minh",
        "Tranh Gấu Trúc Ngộ Nghĩnh",

        // Tranh chân dung và nhân vật (10 sản phẩm)
        "Tranh Chân Dung Cô Gái Trẻ",
        "Tranh Người Phụ Nữ Cổ Điển",
        "Tranh Ông Già Và Biển Cả",
        "Tranh Trẻ Em Vui Chơi",
        "Tranh Cặp Đôi Lãng Mạn",
        "Tranh Gia Đình Hạnh Phúc",
        "Tranh Nghệ Sĩ Đường Phố",
        "Tranh Nông Dân Việt Nam",
        "Tranh Cô Gái Áo Dài",
        "Tranh Dancer Ballet",

        // Tranh theo mùa và dịp lễ (10 sản phẩm)
        "Tranh Lá Cây Vàng Gold Nghệ Thuật",
        "Tranh Cây Lá Vàng Mùa Thu",
        "Tranh Mùa Xuân Hoa Nở",
        "Tranh Mùa Hè Tràn Năng Lượng",
        "Tranh Mùa Thu Lá Vàng",
        "Tranh Mùa Đông Tuyết Trắng",
        "Tranh Tết Nguyên Đán Truyền Thống",
        "Tranh Valentine Tình Yêu",
        "Tranh Giáng Sinh Ấm Áp",
        "Tranh Phụ Nữ Ngày 8/3",

        // Tranh thành phố và kiến trúc (10 sản phẩm)
        "Tranh Thành Phố New York",
        "Tranh Phố Cổ Hà Nội",
        "Tranh Cầu Tháp London",
        "Tranh Tháp Eiffel Paris",
        "Tranh Chùa Việt Nam",
        "Tranh Đình Làng Cổ",
        "Tranh Nhà Sàn Tây Bắc",
        "Tranh Cầu Sài Gòn",
        "Tranh Phố Phường Sài Gòn",
        "Tranh Tokyo Về Đêm",
      ];

      const descriptions = [
        "Tác phẩm nghệ thuật tinh tế, mang đến vẻ đẹp tự nhiên cho không gian sống",
        "Bức tranh được thiết kế tỉ mỉ, phù hợp để trang trí phòng khách sang trọng",
        "Nghệ thuật đương đại với màu sắc hài hòa, tạo điểm nhấn cho căn phòng",
        "Sản phẩm trang trí cao cấp, thể hiện gu thẩm mỹ tinh tế của gia chủ",
        "Tranh nghệ thuật chất lượng cao, in trên canvas bền đẹp",
        "Tác phẩm độc đáo, kết hợp giữa nghệ thuật truyền thống và hiện đại",
        "Bức tranh mang phong cách minimalist, phù hợp với nội thất hiện đại",
        "Nghệ thuật trang trí sang trọng, tạo không gian sống đẳng cấp",
        "Tranh có khung cao cấp, sẵn sàng để treo ngay khi nhận hàng",
        "Sản phẩm handmade tinh xảo, từng chi tiết được chăm chút kỹ lưỡng",
        "Tranh nghệ thuật đẳng cấp với màu sắc sống động và chân thực",
        "Bức tranh mang đến cảm giác thư giãn và bình yên cho tâm hồn",
        "Tác phẩm nghệ thuật hiện đại với thiết kế độc đáo và ấn tượng",
        "Tranh trang trí hoàn hảo cho không gian làm việc chuyên nghiệp",
        "Sản phẩm nghệ thuật chất lượng cao với giá cả hợp lý",
        "Bức tranh biểu tượng của sự sang trọng và tinh tế",
        "Tranh nghệ thuật với phong cách châu Âu cổ điển",
        "Tác phẩm trang trí lý tưởng cho phòng ngủ lãng mạn",
        "Tranh canvas chất lượng museum với màu sắc bền đẹp",
        "Bức tranh mang năng lượng tích cực cho ngôi nhà",
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
      for (let i = 0; i < 100; i++) {
        const name = productNames[i % productNames.length];
        const isOnSale = Math.random() > 0.7; // 30% chance of sale
        const originalPrice = Math.floor(Math.random() * 500000) + 100000; // 100k-600k
        const salePrice = isOnSale
          ? Math.floor(originalPrice * 0.8)
          : originalPrice;
        const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0-5.0
        const reviewCount = Math.floor(Math.random() * 100) + 1;
        const imageIndex = i % imageUrls.length;

        // Tạo slug unique bằng cách thêm số thứ tự nếu trùng tên
        const baseSlug = name
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
          .replace(/^-|-$/g, "");

        const slug = `${baseSlug}-${i + 1}`;

        products.push({
          name: `${name} ${
            i > productNames.length - 1
              ? `Phiên Bản ${Math.floor(i / productNames.length) + 1}`
              : ""
          }`.trim(),
          slug,
          description: descriptions[i % descriptions.length],
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
          suitableFor: suitableForOptions[i % suitableForOptions.length],
          detailedSize: `Phong cách ${
            ["hiện đại", "cổ điển", "tối giản", "nghệ thuật", "trừu tượng"][
              i % 5
            ]
          }, thể hiện ${
            [
              "sự tinh tế",
              "vẻ đẹp tự nhiên",
              "năng lượng tích cực",
              "sự bình yên",
              "tính sáng tạo",
            ][i % 5]
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
        const randomColors = colors
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 1);
        for (const color of randomColors) {
          await prisma.productColor.create({
            data: {
              productId: product.id,
              colorId: color.id,
            },
          });
        }

        // Add size relations (random sizes for each product)
        const randomSizes = sizes
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 1);
        for (const size of randomSizes) {
          await prisma.productSize.create({
            data: {
              productId: product.id,
              sizeId: size.id,
            },
          });
        }

        // Add category relations (1-2 categories per product)
        const numCategories = Math.floor(Math.random() * 2) + 1; // 1 or 2 categories
        const randomCategories = categories
          .sort(() => 0.5 - Math.random())
          .slice(0, numCategories);
        for (const category of randomCategories) {
          await prisma.productCategory.create({
            data: {
              productId: product.id,
              categoryId: category.id,
            },
          });
        }
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
        // Hướng dẫn và lợi ích (15 bài)
        "Lợi ích của tranh nghệ thuật đối với không gian sống",
        "Cách chọn tranh phù hợp cho từng phòng trong nhà",
        "Hướng dẫn bảo quản tranh canvas đúng cách",
        "Top 10 phong cách tranh được yêu thích nhất năm 2024",
        "Nghệ thuật trang trí với tranh trong nội thất hiện đại",
        "Tranh và phong thủy: Tạo năng lượng tích cực cho gia đình",
        "DIY: Tự trang trí khung tranh tại nhà đơn giản",
        "Lịch sử và văn hóa tranh trong nghệ thuật Việt Nam",
        "Color therapy: Liệu pháp màu sắc qua tranh nghệ thuật",
        "Tranh trang trí cho spa tại nhà: Bí quyết thư giãn",
        "Tác động của màu sắc tranh lên tâm trạng và cảm xúc",
        "Cách phối hợp tranh theo từng mùa trong năm",
        "Tranh eco-friendly: Xu hướng xanh cho ngôi nhà",
        "Bí mật của việc sưu tập tranh nghệ thuật",
        "Tranh trong các dịp lễ và sự kiện đặc biệt",

        // Tâm lý và sức khỏe (10 bài)
        "Thiền và tranh mandala: Hành trình tĩnh lặng tâm hồn",
        "Cách tạo không gian lãng mạn với tranh nghệ thuật",
        "Tranh phòng ngủ: Chìa khóa của giấc ngủ yên bình",
        "Khoa học đằng sau tác dụng của màu sắc trong tranh",
        "Tranh handmade vs in kỹ thuật số: Ưu nhược điểm",
        "Tác động của nghệ thuật tranh lên trí nhớ và sáng tạo",
        "Tranh trong thiết kế nội thất hiện đại",
        "Cách kết hợp tranh với ánh sáng để tăng hiệu quả thẩm mỹ",
        "Tranh abstract và meditation: Kết nối tâm linh",
        "Tác dụng của tranh nghệ thuật lên hormone hạnh phúc",

        // Phong cách và xu hướng (15 bài)
        "Tranh mùa đông: Ấm áp cho không gian gia đình",
        "Tranh mùa xuân: Tươi mới và sống động",
        "Tranh mùa hè: Mát mẻ và tươi sáng cho ngôi nhà",
        "Tranh mùa thu: Ấm cúng và lãng mạn",
        "Phong cách Scandinavian với tranh minimalist",
        "Tranh trong phong cách Bohemian và vintage",
        "Cách chăm sóc và vệ sinh tranh canvas",
        "Tranh luxury: Đẳng cấp trong từng chi tiết nghệ thuật",
        "Tranh phong cảnh vs tranh trừu tượng: Chọn gì cho phù hợp",
        "Tranh cho người mệnh kim, mộc, thủy, hỏa, thổ",
        "Cách tạo bộ sưu tập tranh cho gia đình",
        "Tranh trong trị liệu nghệ thuật và giảm căng thẳng",
        "Phong thủy và vị trí treo tranh trong nhà",
        "Tranh trang trí cho phòng gym tại nhà",
        "Cách chọn tranh cho phòng tắm và khu vực ẩm ướt",

        // Ứng dụng thực tế (10 bài)
        "Cách đọc hiểu nghệ thuật tranh để chọn sản phẩm phù hợp",
        "Tranh trong văn hóa Việt Nam truyền thống",
        "Trang trí phòng ăn với tranh cho bữa tiệc gia đình",
        "Tranh và tâm lý học màu sắc trong thiết kế",
        "Hướng dẫn treo tranh an toàn và đẹp mắt",
        "Tranh cho trẻ em: Lưu ý và khuyến nghị phù hợp",
        "Tranh trong cafe và nhà hàng: Tạo không gian độc đáo",
        "Cách tái chế và tái sử dụng khung tranh cũ",
        "Tranh và tác động lên giấc ngủ của trẻ em",
        "Xu hướng tranh nghệ thuật năm 2025",
      ];

      const descriptions = [
        "Khám phá những tác động tích cực của tranh nghệ thuật lên tâm trạng và không gian sống",
        "Hướng dẫn chi tiết cách lựa chọn tranh phù hợp với từng không gian trong ngôi nhà",
        "Những bí quyết để tranh canvas của bạn luôn giữ được chất lượng và màu sắc tốt nhất",
        "Cập nhật những xu hướng phong cách tranh hot nhất được ưa chuộng hiện nay",
        "Biến ngôi nhà thành gallery nghệ thuật với tranh trang trí đẳng cấp",
        "Ứng dụng nguyên lý phong thủy để chọn tranh tạo không gian sống hài hòa",
        "Hướng dẫn từng bước trang trí khung tranh độc đáo tại nhà",
        "Hành trình khám phá di sản văn hóa tranh Việt Nam qua nhiều thế kỷ",
        "Tìm hiểu về liệu pháp màu sắc và ứng dụng trong cuộc sống",
        "Tạo không gian thư giãn như spa ngay tại nhà với tranh nghệ thuật",
        "Nghiên cứu khoa học về tác động của màu sắc đến cảm xúc con người",
        "Bí quyết phối hợp tranh theo từng mùa để tạo không gian sống động",
        "Xu hướng tranh thân thiện môi trường cho ngôi nhà xanh",
        "Kinh nghiệm sưu tập tranh nghệ thuật cho người mới bắt đầu",
        "Cách sử dụng tranh để trang trí trong các dịp lễ và sự kiện",
        "Khám phá sức mạnh tâm linh của tranh mandala trong thiền định",
        "Tạo không gian lãng mạn và ấm cúng với tranh nghệ thuật",
        "Vai trò của tranh trong việc cải thiện chất lượng giấc ngủ",
        "Khoa học về tâm lý màu sắc và ứng dụng trong tranh nghệ thuật",
        "So sánh ưu nhược điểm giữa tranh handmade và in kỹ thuật số",
        "Hướng dẫn đọc hiểu và cảm nhận tranh nghệ thuật một cách sâu sắc",
        "Di sản văn hóa tranh truyền thống Việt Nam qua các thời kỳ",
        "Ý tưởng trang trí phòng ăn với tranh cho bữa tiệc gia đình ấm cúng",
        "Tâm lý học màu sắc và ứng dụng trong thiết kế nội thất",
        "Kỹ thuật treo tranh an toàn và tạo hiệu quả thẩm mỹ cao",
        "Lưu ý quan trọng khi chọn tranh trang trí cho phòng trẻ em",
        "Nghiên cứu về tác động của tranh đến khả năng sáng tạo và trí nhớ",
        "Ứng dụng tranh nghệ thuật trong thiết kế nội thất hiện đại",
        "Cách sử dụng ánh sáng để tăng cường vẻ đẹp của tranh",
        "Sức mạnh tâm linh của tranh abstract trong thiền và meditation",
        "Khoa học về hormone hạnh phúc và tác động của tranh nghệ thuật",
        "Tạo không gian ấm áp mùa đông với tranh nghệ thuật phù hợp",
        "Mang không khí mùa xuân vào nhà với tranh tươi mới và sống động",
        "Tranh mùa hè giúp làm mát và tạo không gian thoáng mát",
        "Không gian ấm cúng mùa thu với tranh nghệ thuật lãng mạn",
        "Phong cách Scandinavian tối giản với tranh minimalist",
        "Tranh vintage và bohemian cho không gian sống độc đáo",
        "Hướng dẫn chăm sóc và bảo quản tranh canvas hiệu quả",
        "Tranh nghệ thuật cao cấp và những chi tiết đẳng cấp",
        "So sánh và lựa chọn giữa tranh phong cảnh và tranh trừu tượng",
        "Chọn tranh theo phong thủy và mệnh của gia chủ",
        "Xây dựng bộ sưu tập tranh gia đình có ý nghĩa",
        "Ứng dụng tranh trong trị liệu nghệ thuật và giảm stress",
        "Nguyên tắc phong thủy trong việc bố trí và treo tranh",
        "Trang trí phòng gym tại nhà với tranh tạo động lực",
        "Lời khuyên chọn tranh cho không gian ẩm ướt và phòng tắm",
        "Tác động của tranh đến tâm lý và giấc ngủ của trẻ nhỏ",
        "Dự đoán xu hướng tranh nghệ thuật sẽ thịnh hành năm 2025",
        "Nghệ thuật trang trí không gian với tranh theo phong cách châu Âu",
        "Bí quyết kết hợp tranh với nội thất để tạo điểm nhấn hoàn hảo",
      ];

      const blogImages = [
        "/img/blog/painting-wellness.jpg",
        "/img/blog/home-art-decoration.jpg",
        "/img/blog/color-therapy.jpg",
        "/img/blog/art-relaxation.jpg",
        "/img/blog/meditation-art.jpg",
        "/img/blog/romantic-art.jpg",
        "/img/blog/modern-art-interior.jpg",
        "/img/blog/seasonal-art-decor.jpg",
        "/img/products/product-1.png",
        "/img/products/product-2.png",
        "/img/products/product-3.png",
        "/img/home/candles/candle-1.svg",
        "/img/home/candles/candle-2.svg",
        "/img/home/candles/candle-3.svg",
      ];

      const contentTemplates = [
        `<h2>Khám phá thế giới tranh nghệ thuật</h2>
         <p>Tranh nghệ thuật không chỉ đơn thuần là vật dụng trang trí mà còn mang trong mình những giá trị sâu sắc về mặt tinh thần và thẩm mỹ.</p>
         <h3>Tác động tích cực đến không gian sống</h3>
         <p>Những nghiên cứu khoa học đã chứng minh rằng màu sắc và hình ảnh có thể ảnh hưởng trực tiếp đến tâm trạng và cảm xúc của con người.</p>
         <p>Việc lựa chọn tranh phù hợp sẽ mang lại những lợi ích tuyệt vời cho cuộc sống hàng ngày của bạn.</p>`,

        `<h2>Bí quyết chọn tranh hoàn hảo</h2>
         <p>Để có được trải nghiệm thẩm mỹ tốt nhất, việc lựa chọn đúng tác phẩm nghệ thuật phù hợp với không gian là vô cùng quan trọng.</p>
         <h3>Những yếu tố cần xem xét</h3>
         <p>Từ kích thước, màu sắc đến phong cách nghệ thuật, mỗi chi tiết đều góp phần tạo nên sự hài hòa cho không gian sống.</p>
         <p>Hãy cùng tìm hiểu những tiêu chí quan trọng để có sự lựa chọn tranh thông minh nhất.</p>`,

        `<h2>Nghệ thuật sống với tranh</h2>
         <p>Tranh nghệ thuật có sức mạnh kỳ diệu trong việc tạo ra những khoảnh khắc đáng nhớ và cảm xúc sâu lắng trong không gian sống.</p>
         <h3>Tạo không gian sống ý nghĩa</h3>
         <p>Mỗi tác phẩm tranh đều mang trong mình một câu chuyện riêng, một cảm xúc đặc biệt mà chỉ bạn mới có thể cảm nhận.</p>
         <p>Khám phá cách kết hợp tranh nghệ thuật với nội thất để tạo ra môi trường sống lý tưởng cho bản thân.</p>`,
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

// Seed all data
export async function seedAll() {
  try {
    console.log("🌱 Starting comprehensive seeding...");

    const colorsResult = await seedColorsAndSizes();
    if (!colorsResult.success) {
      throw new Error(`Colors/Sizes seeding failed: ${colorsResult.error}`);
    }

    const productsResult = await seedProducts();
    if (!productsResult.success) {
      throw new Error(`Products seeding failed: ${productsResult.error}`);
    }

    const postsResult = await seedPosts();
    if (!postsResult.success) {
      throw new Error(`Posts seeding failed: ${postsResult.error}`);
    }

    console.log("🎉 All seeding completed successfully!");
    return {success: true};
  } catch (error) {
    console.error("❌ Error in comprehensive seeding:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to seed all data",
    };
  }
}

// Ensure required data exists for custom products
export async function ensureCustomProductData() {
  try {
    // Check if colors and scents exist
    const [colorCount, scentCount] = await Promise.all([
      prisma.color.count(),
      prisma.scent.count(),
    ]);

    // Seed basic data if needed
    if (colorCount === 0 || scentCount === 0) {
      const result = await seedColorsAndSizes();
      if (!result.success) {
        throw new Error(`Failed to seed basic data: ${result.error}`);
      }
    }

    return {success: true};
  } catch (error) {
    console.error("Error ensuring custom product data:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to ensure custom product data",
    };
  }
}
