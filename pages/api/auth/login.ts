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
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email và mật khẩu là bắt buộc",
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: {email},
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        password: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Email hoặc mật khẩu không đúng",
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        error: "Tài khoản đã bị vô hiệu hóa",
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        error: "Email hoặc mật khẩu không đúng",
      });
    }

    // Update last login
    const updatedUser = await prisma.user.update({
      where: {id: user.id},
      data: {lastLogin: new Date()},
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
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name || "",
          avatar: updatedUser.avatar || undefined,
          role: updatedUser.role,
          lastLogin: updatedUser.lastLogin!,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? "SET" : "NOT_SET",
      },
    });
    return res.status(500).json({
      success: false,
      error: "Đăng nhập thất bại",
      debug:
        process.env.NODE_ENV !== "production"
          ? error instanceof Error
            ? error.message
            : String(error)
          : undefined,
    });
  }
}
