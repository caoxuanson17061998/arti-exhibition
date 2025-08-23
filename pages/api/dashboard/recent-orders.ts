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
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Format dữ liệu theo cấu trúc bảng
    const formattedOrders = recentOrders.map(
      (order: {
        id: any;
        customerName: any;
        items: string | any[];
        total: any;
        createdAt: any;
        status: any;
      }) => ({
        key: order.id,
        customer: order.customerName,
        product:
          // eslint-disable-next-line no-unsafe-optional-chaining
          order.items[0]?.product.name +
          (order.items.length > 1
            ? ` và ${order.items.length - 1} sản phẩm khác`
            : ""),
        total: order.total,
        date: order.createdAt,
        status: order.status,
      }),
    );

    res.json(formattedOrders);
  } catch (error) {
    console.error("Recent orders error:", error);
    res.status(500).json({message: "Internal server error"});
  }
}
