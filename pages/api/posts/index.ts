import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "../../../utils/actions/post-actions";
import type {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method) {
      case "GET": {
        const {published, id} = req.query;

        // If id is provided, get single post
        if (id && typeof id === "string") {
          const result = await getPostById(id);
          if (result.success) {
            return res.status(200).json(result.data);
          }
          return res.status(404).json({error: result.error});
        }

        // Otherwise get all posts
        const publishedFilter =
          published === "true"
            ? true
            : published === "false"
            ? false
            : undefined;

        const result = await getPosts(publishedFilter);
        if (result.success) {
          return res.status(200).json(result.data);
        }
        return res.status(500).json({error: result.error});
      }

      case "POST": {
        const {
          title,
          description,
          content,
          image,
          authorId,
          published: isPublished,
        } = req.body;

        if (!title || !authorId) {
          return res
            .status(400)
            .json({error: "Title and authorId are required"});
        }

        // Create FormData from request body
        const formData = new FormData();
        formData.append("title", title);
        if (description) formData.append("description", description);
        if (content) formData.append("content", content);
        if (image) formData.append("image", image);
        formData.append("authorId", authorId);
        formData.append("published", isPublished ? "true" : "false");

        const createResult = await createPost(formData);
        if (createResult.success) {
          return res.status(201).json(createResult.data);
        }

        // Return more specific error status codes
        if (createResult.error === "Author not found") {
          return res.status(400).json({error: createResult.error});
        }

        return res.status(500).json({error: createResult.error});
      }

      case "PUT": {
        const {id} = req.query;
        if (!id || typeof id !== "string") {
          return res.status(400).json({error: "ID is required for update"});
        }

        const {title, description, content, image, published} = req.body;

        // Create FormData from request body
        const formData = new FormData();
        if (title) formData.append("title", title);
        if (description !== undefined)
          formData.append("description", description || "");
        if (content) formData.append("content", content);
        if (image !== undefined) formData.append("image", image || "");
        formData.append("published", published ? "true" : "false");

        const updateResult = await updatePost(id, formData);
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

        const deleteResult = await deletePost(id);
        if (deleteResult.success) {
          return res.status(200).json({message: "Post deleted successfully"});
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
    console.error("API Error:", error);
    return res.status(500).json({error: "Internal Server Error"});
  }
}
