import {addToCart, setCartOpen} from "@slices/CartSlice";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

interface OrderItem {
  id: string;
  customization?: any;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productName: string;
  productSlug: string;
  productImage: string | null;
  product: {
    id: string;
    name: string;
    slug: string;
    originalPrice: number;
    salePrice: number;
    thumbnailUrl: string | null;
    scents: Array<{
      scent: {
        id: string;
        name: string;
      };
    }>;
    colors: Array<{
      color: {
        id: string;
        name: string;
        hexCode: string;
      };
    }>;
    sizes?: Array<{
      size: {
        id: string;
        name: string;
      };
    }>;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  shippingAddress: string;
  subtotal: number;
  discount: number;
  discountPercentage: number;
  shippingFee: number;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const useHistoryQueries = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [reorderLoading, setReorderLoading] = useState<string | null>(null);

  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const fetchOrders = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Check multiple possible user ID paths
      const userId = user?.user?.id || user?.id;

      if (userId) {
        queryParams.append("userId", userId);
      }

      const requestUrl = `/api/orders?${queryParams.toString()}`;

      const response = await fetch(requestUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const result: OrdersResponse = await response.json();
      console.log("API response:", result);

      if (result.success) {
        setOrders(result.data);
        setPagination(result.pagination);
      } else {
        throw new Error("Failed to load orders");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const reorderItems = async (orderId: string) => {
    try {
      setReorderLoading(orderId);

      const order = orders.find((o) => o.id === orderId);
      if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
      }
      const {items} = order;

      // Convert order items to cart items format
      const cartItemsToAdd = items.map((item) => {
        const {product} = item;

        // Map order item to Product interface for CartSlice
        const cartProduct = {
          id: product.id,
          name: item.productName,
          slug: product.slug,
          description: "", // Will be fetched if needed
          originalPrice: product.originalPrice,
          salePrice: product.salePrice || item.unitPrice,
          rating: 0,
          reviewCount: 0,
          isOnSale:
            product.originalPrice > (product.salePrice || item.unitPrice),
          size: "MEDIUM" as const,
          sizes: [],
          thumbnailUrl: item.productImage || product.thumbnailUrl || "",
          imageUrls: product.thumbnailUrl ? [product.thumbnailUrl] : [],
          createdAt: "",
          updatedAt: "",
          colors: product.colors || [],
          scents: product.scents || [],
          categories: [],
          quantity: item.quantity,
          selectedColors:
            item.customization?.selectedColors ||
            (product.colors?.length > 0
              ? [product.colors[0].color.hexCode]
              : []),
          selectedSize:
            item.customization?.selectedSize ||
            (product.sizes && product.sizes.length > 0
              ? product.sizes[0].size.name
              : undefined),
        };

        return cartProduct;
      });

      // Add each item to cart
      cartItemsToAdd.forEach((cartItem) => {
        dispatch(addToCart(cartItem));
      });

      // Open cart drawer to show items added
      dispatch(setCartOpen(true));

      return {
        success: true,
        message: `Đã thêm ${cartItemsToAdd.length} sản phẩm vào giỏ hàng`,
        itemsCount: cartItemsToAdd.length,
      };
    } catch (err) {
      return {
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng",
        itemsCount: 0,
      };
    } finally {
      setReorderLoading(null);
    }
  };

  useEffect(() => {
    const userId = user?.user?.id || user?.id;
    if (userId) {
      fetchOrders();
    }
  }, [user?.user?.id, user?.id]);

  return {
    orders,
    loading,
    error,
    pagination,
    reorderLoading,
    fetchOrders,
    reorderItems,
    refetch: () => fetchOrders(pagination.page, pagination.limit),
  };
};
