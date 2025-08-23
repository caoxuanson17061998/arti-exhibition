import prisma from "../utils/db";

async function checkDataCounts() {
  try {
    console.log("📊 Kiểm tra số lượng dữ liệu trong database...\n");

    const [userCount, colorCount, categoryCount, productCount, postCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.color.count(),
        prisma.category.count(),
        prisma.product.count(),
        prisma.post.count(),
      ]);

    console.log("🏢 === THỐNG KÊ DATABASE ===");
    console.log(`👥 Users: ${userCount}`);
    console.log(`🎨 Colors: ${colorCount}`);
    console.log(`📂 Categories: ${categoryCount}`);
    console.log(`🕯️  Products: ${productCount}`);
    console.log(`📝 Posts: ${postCount}`);
    console.log("================================\n");

    if (productCount > 0) {
      const products = await prisma.product.findMany({
        include: {
          colors: {
            include: {
              color: true,
            },
          },
          categories: {
            include: {
              category: true,
            },
          },
        },
      });

      console.log("🕯️ === SẢN PHẨM ===");
      products.forEach((product: any, index: number) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   💰 Giá: ${product.salePrice.toLocaleString()}đ`);
        console.log(
          `   ⭐ Rating: ${product.rating}/5 (${product.reviewCount} reviews)`,
        );
        console.log(
          `   🏷️  Categories: ${product.categories
            .map((c: any) => c.category.name)
            .join(", ")}`,
        );
        console.log(
          `    Colors: ${product.colors
            .map((c: any) => c.color.name)
            .join(", ")}`,
        );
        console.log("");
      });
    }

    if (postCount > 0) {
      const posts = await prisma.post.findMany({
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      console.log("📝 === BLOG POSTS ===");
      posts.forEach((post: any, index: number) => {
        console.log(`${index + 1}. ${post.title}`);
        console.log(`   👤 Tác giả: ${post.author.name || post.author.email}`);
        console.log(
          `   📅 Ngày tạo: ${post.createdAt.toLocaleDateString("vi-VN")}`,
        );
        console.log(
          `   📊 Trạng thái: ${
            post.published ? "✅ Đã xuất bản" : "📝 Bản nháp"
          }`,
        );
        console.log("");
      });
    }

    console.log("✨ Kiểm tra hoàn tất! Database đã sẵn sàng sử dụng.");
  } catch (error) {
    console.error("❌ Lỗi khi kiểm tra dữ liệu:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDataCounts();
