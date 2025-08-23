import prisma from "../../../utils/db";
import bcrypt from "bcryptjs";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({message: "Method not allowed"});
  }

  try {
    const {email, password, fullName, secretKey} = req.body;

    // Simple protection to prevent unauthorized access
    if (secretKey !== "art-exhibition-admin-setup") {
      return res.status(403).json({
        success: false,
        error: "Không được phép thực hiện hành động này",
      });
    }

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: "Vui lòng điền đầy đủ thông tin",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {email},
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email đã được sử dụng",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const user = await prisma.user.create({
      data: {
        email,
        name: fullName,
        password: hashedPassword,
        isActive: true,
        role: "admin", // Set role to admin
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name || "",
          avatar: user.avatar || undefined,
          role: user.role,
        },
        message: "Tài khoản admin đã được tạo thành công",
      },
    });
  } catch (error) {
    console.error("Admin creation error:", error);
    return res.status(500).json({
      success: false,
      error: "Tạo tài khoản admin thất bại",
    });
  }
}
