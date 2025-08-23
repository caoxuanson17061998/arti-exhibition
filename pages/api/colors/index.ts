import {
  createColor,
  deleteColor,
  getColorById,
  getColors,
  updateColor,
} from "@utils/actions/color-actions";
import type {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method) {
      case "GET": {
        const {id} = req.query;

        if (id && typeof id === "string") {
          const result = await getColorById(id);
          if (result.success) {
            return res.status(200).json(result.data);
          }
          return res.status(404).json({error: result.error});
        }

        const result = await getColors();
        if (result.success) {
          return res.status(200).json(result.data);
        }
        return res.status(500).json({error: result.error});
      }

      case "POST": {
        const {name, hexCode} = req.body;

        if (!name || !hexCode) {
          return res
            .status(400)
            .json({error: "Both name and hexCode are required"});
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("hexCode", hexCode);

        const createResult = await createColor(formData);
        if (createResult.success) {
          return res.status(201).json(createResult.data);
        }

        return res.status(500).json({error: createResult.error});
      }

      case "PUT": {
        const {id} = req.query;

        if (!id || typeof id !== "string") {
          return res.status(400).json({error: "ID is required for update"});
        }

        const {name, hexCode} = req.body;

        if (!name || !hexCode) {
          return res
            .status(400)
            .json({error: "Both name and hexCode are required"});
        }

        const updateResult = await updateColor(id, {name, hexCode});

        if (updateResult.success) {
          return res.status(200).json(updateResult.data);
        }

        return res.status(500).json({error: updateResult.error});
      }

      case "DELETE": {
        const {id} = req.query;
        if (!id || typeof id !== "string") {
          return res.status(400).json({error: "ID is required for delete"});
        }

        const deleteResult = await deleteColor(id);
        if (deleteResult.success) {
          return res.status(200).json({message: "Color deleted successfully"});
        }

        return res.status(500).json({error: deleteResult.error});
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res
          .status(405)
          .json({error: `Method ${req.method} Not Allowed`});
    }
  } catch (error) {
    return res.status(500).json({error: "Internal Server Error"});
  }

  // Fallback return statement to satisfy ESLint
  return res.status(500).json({error: "Unexpected error occurred"});
}
