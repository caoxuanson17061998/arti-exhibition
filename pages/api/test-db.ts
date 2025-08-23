import prisma from "../../utils/db";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Test database connection
    await prisma.$connect();

    // Try to count users (simple query)
    const userCount = await prisma.user.count();

    await prisma.$disconnect();

    return res.status(200).json({
      success: true,
      message: "Database connection successful",
      userCount,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? "SET" : "NOT_SET",
      },
    });
  } catch (error) {
    console.error("Database test error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? "SET" : "NOT_SET",
      },
    });
  }
}
