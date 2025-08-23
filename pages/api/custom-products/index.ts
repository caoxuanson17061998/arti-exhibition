import {
  getCustomizationOptions,
  getOrCreateBaseCustomProduct,
} from "@utils/actions/custom-product-actions";
import type {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method) {
      case "GET": {
        const {action} = req.query;

        if (action === "base-product") {
          const result = await getOrCreateBaseCustomProduct();
          return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({error: result.error});
        }

        if (action === "options") {
          const result = await getCustomizationOptions();
          return result.success
            ? res.status(200).json(result.data)
            : res.status(500).json({error: result.error});
        }

        return res.status(400).json({error: "Invalid action parameter"});
      }

      case "POST": {
        // This endpoint is deprecated - custom products should not be created in database
        // They should only exist as cart items with customization metadata
        return res.status(410).json({
          error:
            "This endpoint is deprecated. Custom products are now handled as cart items only.",
          message:
            "Please use the frontend cart system to handle custom product orders.",
        });
      }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({
          error: "Method not allowed",
        });
    }
  } catch (error) {
    console.error("Custom products API error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
