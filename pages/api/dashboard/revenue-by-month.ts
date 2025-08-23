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
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfYear,
        },
        status: {
          in: ["confirmed", "shipped", "delivered"],
        },
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    // Khởi tạo mảng doanh thu cho 12 tháng
    const monthlyRevenue = Array(12).fill(0);

    // Tính tổng doanh thu cho từng tháng
    orders.forEach((order: {createdAt: {getMonth: () => any}; total: any}) => {
      const month = order.createdAt.getMonth();
      monthlyRevenue[month] += order.total;
    });

    // Format dữ liệu theo định dạng của chart
    const data = {
      labels: [
        "Th1",
        "Th2",
        "Th3",
        "Th4",
        "Th5",
        "Th6",
        "Th7",
        "Th8",
        "Th9",
        "Th10",
        "Th11",
        "Th12",
      ],
      datasets: [
        {
          label: "Doanh thu (VNĐ)",
          data: monthlyRevenue,
          backgroundColor: "#4FC3F7",
          borderRadius: 6,
        },
      ],
    };

    res.json(data);
  } catch (error) {
    console.error("Revenue by month error:", error);
    res.status(500).json({message: "Internal server error"});
  }
}
