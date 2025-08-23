export interface OrderItemData {
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateOrderData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  subtotal: number;
  discount: number;
  discountPercentage: number;
  shippingFee: number;
  total: number;
  shippingMethod: "standard" | "express";
  paymentMethod: "cod" | "online";
  userId?: string;
  items: OrderItemData[];
}

export async function createOrder(data: CreateOrderData) {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Create order error:", error);
    return {
      success: false,
      error: "Lỗi khi tạo đơn hàng",
    };
  }
}

export async function getOrders(userId?: string, page = 1, limit = 10) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (userId) {
      params.append("userId", userId);
    }

    const response = await fetch(`/api/orders?${params}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Get orders error:", error);
    return {
      success: false,
      error: "Lỗi khi lấy danh sách đơn hàng",
    };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({status}),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Update order status error:", error);
    return {
      success: false,
      error: "Lỗi khi cập nhật trạng thái đơn hàng",
    };
  }
}

export async function getOrderById(orderId: string) {
  try {
    const response = await fetch(`/api/orders/${orderId}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Get order by ID error:", error);
    return {
      success: false,
      error: "Lỗi khi lấy thông tin đơn hàng",
    };
  }
}
