import {verifyToken} from "../../../utils/actions/auth-actions";
import type {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({error: `Method ${req.method} Not Allowed`});
  }

  try {
    const {token} = req.body;

    if (!token) {
      return res.status(400).json({error: "Token là bắt buộc"});
    }

    const result = await verifyToken(token);

    if (result.success) {
      return res.status(200).json({
        message: "Token hợp lệ",
        user: result.data?.user,
      });
    }
    return res.status(401).json({error: result.error});
  } catch (error) {
    console.error("Token verification API Error:", error);
    return res.status(500).json({error: "Lỗi máy chủ nội bộ"});
  }
}
