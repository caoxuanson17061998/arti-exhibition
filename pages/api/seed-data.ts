import {
  seedAll,
  seedColorsAndCategories,
  seedPosts,
  seedProducts,
} from "../../utils/actions/seed-data-new";
import type {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const {type} = req.body;
    let result;

    switch (type) {
      case "colors-sizes":
        result = await seedColorsAndCategories();
        break;
      case "products":
        result = await seedProducts();
        break;
      case "posts":
        result = await seedPosts();
        break;
      case "all":
      default:
        result = await seedAll();
        break;
    }

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Data seeded successfully",
      });
    }
    return res.status(500).json({
      success: false,
      error: result.error,
    });
  } catch (error) {
    console.error("Seed data API error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
