import prisma from "@app/utils/db";
import {NextApiRequest, NextApiResponse} from "next";

// eslint-disable-next-line consistent-return
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({message: "Method not allowed"});
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true,
      },
    });

    const categoryStats = categories.map(
      (category: {name: any; products: string | any[]}) => ({
        name: category.name,
        count: category.products.length,
      }),
    );

    res.json(categoryStats);
  } catch (error) {
    console.error("Products by category error:", error);
    res.status(500).json({message: "Internal server error"});
  }
}
