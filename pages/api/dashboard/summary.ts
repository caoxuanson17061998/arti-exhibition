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
    const [orders, users, posts] = await Promise.all([
      prisma.order.findMany(),
      prisma.user.count({
        where: {
          role: "user",
          isActive: true,
        },
      }),
      prisma.post.count({
        where: {
          published: true,
        },
      }),
    ]);

    // Tính toán các thống kê từ orders
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum: any, order: {total: any}) => sum + order.total,
      0,
    );
    const successfulOrders = orders.filter((order: {status: string}) =>
      ["confirmed", "shipped", "delivered"].includes(order.status),
    ).length;
    const cancelledOrders = orders.filter(
      (order: {status: string}) => order.status === "cancelled",
    ).length;
    const cancelRate = totalOrders ? (cancelledOrders / totalOrders) * 100 : 0;

    // Tính số khách hàng mới trong ngày
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newCustomersToday = await prisma.user.count({
      where: {
        role: "user",
        isActive: true,
        createdAt: {
          gte: today,
        },
      },
    });

    res.json({
      totalRevenue,
      totalCustomers: users,
      newCustomersToday,
      totalPosts: posts,
      totalOrders,
      successfulOrders,
      cancelledOrders,
      cancelRate: cancelRate.toFixed(2),
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({message: "Internal server error"});
  }
}
