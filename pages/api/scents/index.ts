import {
  createScent,
  deleteScent,
  getScentById,
  getScents,
  updateScent,
} from "@utils/actions/scent-actions";
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
          const result = await getScentById(id);
          if (result.success) {
            return res.status(200).json(result.data);
          }
          return res.status(404).json({error: result.error});
        }

        const result = await getScents();
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

        const createResult = await createScent(formData);
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

        const formData = new FormData();
        formData.append("name", name);

        const updateResult = await updateScent(id, {name});

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

        const deleteResult = await deleteScent(id);
        if (deleteResult.success) {
          return res.status(200).json({message: "Scent deleted successfully"});
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
