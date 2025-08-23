import {
  deleteUser,
  getUserById,
  updateUser,
} from "../../../utils/actions/user-actions";
import type {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {id} = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({error: "Invalid user ID"});
  }

  try {
    switch (req.method) {
      case "GET":
        const result = await getUserById(id);
        if (result.success) {
          return res.status(200).json(result.data);
        }
        return res.status(404).json({error: result.error});

      case "PUT":
        const {email, name, avatar} = req.body;

        // Create FormData from request body
        const formData = new FormData();
        if (email) formData.append("email", email);
        if (name) formData.append("name", name);
        if (avatar) formData.append("avatar", avatar);

        const updateResult = await updateUser(id, formData);
        if (updateResult.success) {
          return res.status(200).json(updateResult.data);
        }
        return res.status(500).json({error: updateResult.error});

      case "DELETE":
        const deleteResult = await deleteUser(id);
        if (deleteResult.success) {
          return res.status(200).json({message: "User deleted successfully"});
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
