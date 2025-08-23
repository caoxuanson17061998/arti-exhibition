import prisma from "../../../utils/db";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {id} = req.query;

  // Nếu có id, xử lý cho 1 đơn hàng
  if (id) {
    if (req.method === "GET") {
      // Lấy 1 đơn hàng
      try {
        const order = await prisma.order.findUnique({
          where: {id: id as string},
          include: {
            items: true,
            user: true,
          },
        });
        if (!order) {
          return res
            .status(404)
            .json({success: false, message: "Không tìm thấy đơn hàng"});
        }
        return res.status(200).json({success: true, data: order});
      } catch (error) {
        return res
          .status(500)
          .json({success: false, message: "Lỗi server khi lấy đơn hàng"});
      }
    } else if (req.method === "PATCH" || req.method === "PUT") {
      // Cập nhật 1 đơn hàng
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
            items: true,
            user: true,
          },
        });
        return res.status(200).json({
          success: true,
          message: "Cập nhật đơn hàng thành công",
          data: updatedOrder,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Lỗi server khi cập nhật đơn hàng",
        });
      }
    } else {
      res.setHeader("Allow", ["GET", "PATCH", "PUT"]);
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }
    return undefined;
  }

  if (req.method === "POST") {
    try {
      const {
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress,
        subtotal,
        discount,
        discountPercentage,
        shippingFee,
        total,
        shippingMethod,
        paymentMethod,
        items,
        userId,
      } = req.body;

      // Validate required fields
      if (
        !customerName ||
        !customerPhone ||
        !shippingAddress ||
        !items ||
        items.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin bắt buộc",
        });
      }

      // Generate order number
      const orderNumber = `HD${Date.now()}`;

      // Create order with items in database
      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerName,
          customerPhone,
          customerEmail,
          shippingAddress,
          subtotal,
          discount,
          discountPercentage,
          shippingFee,
          total,
          shippingMethod,
          paymentMethod,
          userId,
          items: {
            create: items.map((item: any) => {
              // Build detailed product name with customization info
              let detailedProductName = item.productName;
              const customDetails = [];

              // Add selected colors
              if (item.selectedColors && item.selectedColors.length > 0) {
                customDetails.push(`Màu: ${item.selectedColors.join(", ")}`);
              }

              // Add selected size
              if (item.selectedSize) {
                customDetails.push(`Kích thước: ${item.selectedSize}`);
              }

              if (item.customization && item.customization.isCustomProduct) {
                // This is a custom product, add additional customization details
                if (item.customization.title) {
                  customDetails.push(`Nội dung: "${item.customization.title}"`);
                }

                if (item.customization.logoSize) {
                  const sizeLabel =
                    item.customization.logoSize === "S"
                      ? "Nhỏ"
                      : item.customization.logoSize === "M"
                      ? "Vừa"
                      : "Lớn";
                  customDetails.push(`Logo: ${sizeLabel}`);
                }

                if (item.customization.uploadedImage) {
                  customDetails.push("Hình ảnh tùy chỉnh");
                }
              }

              if (customDetails.length > 0) {
                detailedProductName += ` (${customDetails.join(", ")})`;
              }

              return {
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                productName: detailedProductName,
                productSlug: item.productSlug,
                productImage: item.productImage,
                productId: item.productId,
                customization: {
                  ...item.customization,
                  selectedColors: item.selectedColors || [],
                  selectedSize: item.selectedSize || null,
                },
              };
            }),
          },
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

      console.log("Order created in database:", order);

      return res.status(201).json({
        success: true,
        message: "Đặt hàng thành công",
        data: order,
      });
    } catch (error) {
      console.error("Create order error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi tạo đơn hàng",
      });
    }
  } else if (req.method === "GET") {
    try {
      const {userId, page = 1, limit = 10} = req.query;

      console.log("GET orders - userId:", userId);
      console.log("GET orders - query params:", req.query);

      const skip = (Number(page) - 1) * Number(limit);
      const where = userId ? {userId: userId as string} : {};

      console.log("GET orders - where clause:", where);

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            items: {
              include: {
                product: {
                  include: {
                    sizes: {
                      include: {
                        size: true,
                      },
                    },
                    colors: {
                      include: {
                        color: true,
                      },
                    },
                    categories: {
                      include: {
                        category: true,
                      },
                    },
                  },
                },
              },
            },
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: Number(limit),
        }),
        prisma.order.count({where}),
      ]);

      console.log("GET orders - found orders:", orders.length);
      console.log("GET orders - total count:", total);

      return res.status(200).json({
        success: true,
        data: orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error("Get orders error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách đơn hàng",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }
  return undefined;
}
