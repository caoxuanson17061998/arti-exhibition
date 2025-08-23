import {
  createUser,
  deleteUser,
  getUsers,
} from "../../../utils/actions/user-actions";
import type {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method) {
      case "GET": {
        const {keyword, page, perPage, role} = req.query;

        // Parse query parameters
        const params = {
          keyword: keyword as string,
          page: page ? parseInt(page as string, 10) : undefined,
          perPage: perPage ? parseInt(perPage as string, 10) : undefined,
          role: role as string,
        };

        const result = await getUsers(params);
        if (result.success) {
          return res.status(200).json(result.data);
        }
        return res.status(500).json({error: result.error});
      }

      case "POST": {
        const {email, name, avatar, password} = req.body;

        if (!email || !password) {
          return res
            .status(400)
            .json({error: "Email and password are required"});
        }

        // Create FormData from request body
        const formData = new FormData();
        formData.append("email", email);
        if (name) formData.append("name", name);
        if (avatar) formData.append("avatar", avatar);
        formData.append("password", password);

        const createResult = await createUser(formData);
        if (createResult.success) {
          return res.status(201).json(createResult.data);
        }
        return res.status(500).json({error: createResult.error});
      }

      case "DELETE": {
        const {id} = req.query;
        if (!id || typeof id !== "string") {
          return res.status(400).json({error: "ID is required for delete"});
        }

        const deleteResult = await deleteUser(id);
        if (deleteResult.success) {
          return res.status(200).json({message: "User deleted successfully"});
        }
        return res.status(500).json({error: deleteResult.error});
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        return res
          .status(405)
          .json({error: `Method ${req.method} Not Allowed`});
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({error: "Internal Server Error"});
  }
}
