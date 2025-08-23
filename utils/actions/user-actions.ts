/* eslint-disable */
import prisma from "../db";
import {revalidateTag} from "next/cache";

// User CRUD Operations

export async function createUser(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const avatar = formData.get("avatar") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        avatar,
        password,
      },
    });

    revalidateTag("users");
    return {success: true, data: user};
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}

export async function getUsers(params?: {
  keyword?: string;
  page?: number;
  perPage?: number;
  role?: string;
}) {
  try {
    const {keyword, page = 1, perPage = 10, role} = params || {};

    // Build where condition
    const where: any = {};

    // Search filter
    if (keyword && keyword.trim()) {
      where.OR = [
        {
          name: {
            contains: keyword.trim(),
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: keyword.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    // Role filter
    if (role && role.trim()) {
      where.role = role.trim();
    }

    // Calculate pagination
    const skip = (page - 1) * perPage;
    const take = perPage;

    // Get total count for pagination
    const total = await prisma.user.count({where});

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      include: {
        posts: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    });

    return {
      success: true,
      data: {
        users,
        pagination: {
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {id},
      include: {
        posts: true,
      },
    });

    if (!user) {
      return {success: false, error: "User not found"};
    }

    return {success: true, data: user};
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch user",
    };
  }
}

export async function updateUser(id: string, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const avatar = formData.get("avatar") as string;

    const user = await prisma.user.update({
      where: {id},
      data: {
        ...(email && {email}),
        ...(name && {name}),
        ...(avatar && {avatar}),
      },
    });

    revalidateTag("users");
    return {success: true, data: user};
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: {id},
    });

    revalidateTag("users");
    return {success: true};
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
}
