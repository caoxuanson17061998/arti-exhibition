import prisma from "../../../utils/db";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("Orders [id] API - Method:", req.method);
  console.log("Orders [id] API - ID:", req.query.id);
  console.log("Orders [id] API - Body:", req.body);

  const {id} = req.query;

  if (req.method === "GET") {
    try {
      const order = await prisma.order.findUnique({
        where: {id: id as string},
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error("Get order by ID error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy thông tin đơn hàng",
      });
    }
  } else if (req.method === "PUT" || req.method === "PATCH") {
    try {
      const {status, paymentStatus} = req.body;

      const updatedOrder = await prisma.order.update({
        where: {id: id as string},
        data: {
          ...(status && {status}),
          ...(paymentStatus && {paymentStatus}),
          updatedAt: new Date(),
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Cập nhật đơn hàng thành công",
        data: updatedOrder,
      });
    } catch (error) {
      console.error("Update order error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi cập nhật đơn hàng",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "PATCH"]);
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }
}
