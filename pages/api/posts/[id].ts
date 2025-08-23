import {
  deletePost,
  getPostById,
  updatePost,
} from "../../../utils/actions/post-actions";
import type {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {id} = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({error: "Invalid post ID"});
  }

  try {
    switch (req.method) {
      case "GET":
        const getResult = await getPostById(id);
        if (getResult.success) {
          return res.status(200).json(getResult.data);
        }
        return res.status(404).json({error: getResult.error});

      case "PUT":
        const {title, description, content, published} = req.body;

        // Create FormData from request body
        const formData = new FormData();
        if (title) formData.append("title", title);
        if (description !== undefined)
          formData.append("description", description || "");
        if (content) formData.append("content", content);
        formData.append("published", published ? "true" : "false");

        const updateResult = await updatePost(id, formData);
        if (updateResult.success) {
          return res.status(200).json(updateResult.data);
        }
        return res.status(500).json({error: updateResult.error});

      case "DELETE":
        const deleteResult = await deletePost(id);
        if (deleteResult.success) {
          return res.status(200).json({message: "Post deleted successfully"});
        }
        return res.status(500).json({error: deleteResult.error});

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res
          .status(405)
          .json({error: `Method ${req.method} Not Allowed`});
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({error: "Internal Server Error"});
  }
}
