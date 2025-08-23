import {
  seedAll,
  seedColorsAndCategories,
  seedPosts,
  seedProducts,
} from "../utils/actions/seed-data-new";

async function main() {
  console.log("🌱 Bắt đầu seed database...");

  // Get command line argument for seed type
  const seedType = process.argv[2] || "all";

  try {
    let result;

    switch (seedType) {
      case "colors":
        console.log("🎨 Seeding colors, sizes, and categories...");
        result = await seedColorsAndCategories();
        break;
      case "products":
        console.log("🕯️ Seeding products...");
        result = await seedProducts();
        break;
      case "posts":
        console.log("📝 Seeding blog posts...");
        result = await seedPosts();
        break;
      case "all":
      default:
        console.log("🌟 Seeding all data...");
        result = await seedAll();
        break;
    }

    if (result.success) {
      console.log("✅ Seed database thành công!");
    } else {
      console.error("❌ Seed database thất bại:", result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Lỗi khi seed database:", error);
    process.exit(1);
  }
}

main()
  .catch((error) => {
    console.error("❌ Lỗi không mong muốn:", error);
    process.exit(1);
  })
  .finally(() => {
    console.log("🏁 Hoàn thành quá trình seed");
    console.log("💡 Cách sử dụng:");
    console.log("  - npm run seed colors    # Seed colors, sizes, categories");
    console.log("  - npm run seed products  # Seed products");
    console.log("  - npm run seed posts     # Seed blog posts");
    console.log("  - npm run seed all       # Seed all data");
  });
