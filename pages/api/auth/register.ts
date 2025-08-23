import prisma from "../../../utils/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {NextApiRequest, NextApiResponse} from "next";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key-here";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({message: "Method not allowed"});
  }

  try {
    const {email, password, fullName} = req.body;

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

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        name: fullName,
        password: hashedPassword,
        isActive: true,
        role: "user",
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        lastLogin: true,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      {expiresIn: "24h"},
    );

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name || "",
          avatar: user.avatar || undefined,
          role: user.role,
          lastLogin: user.lastLogin!,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      error: "Đăng ký thất bại",
    });
  }
}
