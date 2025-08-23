import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "@utils/actions/category-actions";
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
          const result = await getCategoryById(id);
          if (result.success) {
            return res.status(200).json(result.data);
          }
          return res.status(404).json({error: result.error});
        }

        const result = await getCategories();
        if (result.success) {
          return res.status(200).json(result.data);
        }
        return res.status(500).json({error: result.error});
      }

      case "POST": {
        const {name} = req.body;

        if (!name) {
          return res.status(400).json({error: "Name is required"});
        }

        const formData = new FormData();
        formData.append("name", name);

        const createResult = await createCategory(formData);
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

        const {name} = req.body;

        if (!name) {
          return res.status(400).json({error: "Name is required"});
        }

        const updateResult = await updateCategory(id, {name});

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

        const deleteResult = await deleteCategory(id);
        if (deleteResult.success) {
          return res
            .status(200)
            .json({message: "Category deleted successfully"});
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
}
