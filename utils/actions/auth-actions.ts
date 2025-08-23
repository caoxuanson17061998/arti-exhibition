import prisma from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {revalidateTag} from "next/cache";

// Auth response type
interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      avatar?: string;
      lastLogin: Date;
    };
    token: string;
  };
  error?: string;
}

// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key-here";

// Login action
export async function loginUser(formData: FormData): Promise<AuthResponse> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return {success: false, error: "Email và mật khẩu là bắt buộc"};
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
        isActive: true,
      },
    });

    if (!user) {
      return {success: false, error: "Email hoặc mật khẩu không đúng"};
    }

    if (!user.isActive) {
      return {success: false, error: "Tài khoản đã bị vô hiệu hóa"};
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return {success: false, error: "Email hoặc mật khẩu không đúng"};
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
        lastLogin: true,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      {expiresIn: "24h"},
    );

    revalidateTag("auth");
    return {
      success: true,
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name || "",
          avatar: updatedUser.avatar || undefined,
          lastLogin: updatedUser.lastLogin!,
        },
        token,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Đăng nhập thất bại",
    };
  }
}

// Register action
export async function registerUser(formData: FormData): Promise<AuthResponse> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("fullName") as string;

    if (!email || !password || !name) {
      return {success: false, error: "Vui lòng điền đầy đủ thông tin"};
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {email},
    });

    if (existingUser) {
      return {success: false, error: "Email đã được sử dụng"};
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        lastLogin: true,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      {expiresIn: "24h"},
    );

    revalidateTag("auth");
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name || "",
          avatar: user.avatar || undefined,
          lastLogin: user.lastLogin!,
        },
        token,
      },
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Đăng ký thất bại",
    };
  }
}

// Verify token action
export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: {id: decoded.userId},
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        isActive: true,
        lastLogin: true,
      },
    });

    if (!user || !user.isActive) {
      return {success: false, error: "Token không hợp lệ"};
    }

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name || "",
          avatar: user.avatar,
          lastLogin: user.lastLogin!,
        },
      },
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return {
      success: false,
      error: "Token không hợp lệ hoặc đã hết hạn",
    };
  }
}

// Change password action
export async function changePassword(userId: string, formData: FormData) {
  try {
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    if (!currentPassword || !newPassword) {
      return {
        success: false,
        error: "Mật khẩu hiện tại và mật khẩu mới là bắt buộc",
      };
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: {id: userId},
      select: {password: true},
    });

    if (!user) {
      return {success: false, error: "Người dùng không tồn tại"};
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isValidPassword) {
      return {success: false, error: "Mật khẩu hiện tại không đúng"};
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: {id: userId},
      data: {password: hashedNewPassword},
    });

    revalidateTag("auth");
    return {success: true};
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Đổi mật khẩu thất bại",
    };
  }
}
