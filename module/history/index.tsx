import {useHistoryQueries} from "./useHistoryQueries";
import {notification} from "antd";
import Image from "next/image";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const getStatusDisplay = (status: string) => {
  const statusMap: {[key: string]: {text: string; className: string}} = {
    pending: {text: "Chờ xử lý", className: "bg-[#FEF3C7] text-[#92400E]"},
    confirmed: {text: "Đã xác nhận", className: "bg-[#DBEAFE] text-[#1E40AF]"},
    shipped: {text: "Đang giao", className: "bg-[#E0E7FF] text-[#5B21B6]"},
    delivered: {text: "Thành công", className: "bg-[#D1FADF] text-[#039855]"},
    cancelled: {text: "Đã hủy", className: "bg-[#FEE2E2] text-[#DC2626]"},
  };

  return (
    statusMap[status] || {text: status, className: "bg-gray-200 text-gray-800"}
  );
};

const colorHexMap: Record<string, string> = {
  dustyRose: "#E8A9B2",
  powderBlue: "#A6C9E2",
  blushPink: "#E8A9B2",
  mintGreen: "#AED8B2",
  charcoalBlack: "#2C2C2C",
  softWhite: "#F2F2F2",
};

export function History() {
  const {
    orders,
    loading,
    error,
    pagination,
    reorderItems,
    fetchOrders,
    reorderLoading,
  } = useHistoryQueries();
  const user = useSelector((state: any) => state.user);
  const router = useRouter();

  // Debug logging
  console.log("History component - user:", user);
  console.log("History component - orders:", orders);

  const handleReorder = async (orderId: string) => {
    const result = await reorderItems(orderId);

    if (result.success) {
      notification.success({
        message: "Mua lại thành công!",
        description: result.message,
        duration: 3,
      });

      // Optional: Navigate to cart page
      // router.push('/cart-checkout');
    } else {
      notification.error({
        message: "Mua lại thất bại",
        description: result.message,
        duration: 4,
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center px-2 md:px-0 py-8 min-h-[80vh] bg-[#f8fafc]">
        <div className="w-full max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-semibold mb-1 text-[#212B36]">
            Lịch sử đơn hàng
          </h1>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#212B36]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center px-2 md:px-0 py-8 min-h-[80vh] bg-[#f8fafc]">
        <div className="w-full max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-semibold mb-1 text-[#212B36]">
            Lịch sử đơn hàng
          </h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            Có lỗi xảy ra: {error}
          </div>
        </div>
      </div>
    );
  }

  const userId = user?.user?.id || user?.id;

  if (!userId) {
    return (
      <div className="w-full flex flex-col items-center px-2 md:px-0 py-8 min-h-[80vh] bg-[#f8fafc]">
        <div className="w-full max-w-3xl">
          <h1 className="text-2xl md:text-3xl font-semibold mb-1 text-[#212B36]">
            Lịch sử đơn hàng
          </h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            Vui lòng đăng nhập để xem lịch sử đơn hàng
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center px-2 md:px-0 py-8 min-h-[80vh] bg-[#f8fafc]">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#212B36]">
            Lịch sử đơn hàng
          </h1>
          <button
            onClick={() => {
              fetchOrders();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
          >
            Làm mới
          </button>
        </div>
        <p className="text-sm text-[#919EAB] mb-6">
          {pagination.total} đơn hàng | User ID: {userId || "Không có"}
        </p>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="mb-4">
              <svg
                width="64"
                height="64"
                fill="none"
                viewBox="0 0 64 64"
                className="mx-auto text-gray-300"
              >
                <path
                  d="M8 16h6l4 20h32l4-12H22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="25"
                  cy="46"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="45"
                  cy="46"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <p className="text-[#919EAB] text-lg mb-4">
              Bạn chưa có đơn hàng nào
            </p>
            <button
              onClick={() => router.push("/products")}
              className="bg-[#212B36] text-white px-6 py-2 rounded-lg hover:bg-[#161a22] transition-colors"
            >
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = getStatusDisplay(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm p-0 md:p-6 overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between px-4 md:px-6 py-4 border-b border-[#F2F2F2] gap-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <span className="font-semibold text-base md:text-lg text-[#212B36]">
                        Đơn hàng #{order.orderNumber}
                      </span>
                      <span className="text-[#637381] text-sm md:ml-2">
                        {order.items.length} sản phẩm
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <span className="text-[#919EAB] text-xs flex items-center gap-1">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 16 16"
                        >
                          <circle cx="8" cy="8" r="8" fill="#E1BDA9" />
                          <path
                            d="M8 4v4l2.5 2.5"
                            stroke="#fff"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {formatDate(order.createdAt)}
                      </span>
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-lg w-fit text-center ${statusInfo.className}`}
                      >
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="divide-y divide-dashed divide-[#E5E7EB]">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col md:flex-row items-start md:items-center gap-4 px-4 md:px-6 py-4"
                      >
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-[#f3f4f6] flex-shrink-0">
                          <Image
                            src={
                              item.productImage ||
                              item.product.thumbnailUrl ||
                              "/img/placeholder.png"
                            }
                            alt={item.productName}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 w-full flex flex-col gap-1">
                          <span className="font-semibold text-base text-[#212B36]">
                            {item.customization
                              ? `${item.productName}`
                              : item.productName}
                          </span>
                          {/* <span className="text-sm text-[#637381] flex items-center gap-2">
                            {item.customization ? (
                              <>
                                {item.customization.selectedScents?.length >
                                  0 && (
                                  <>
                                    Mùi:{" "}
                                    {item.customization.selectedScents.join(
                                      ", ",
                                    )}{" "}
                                  </>
                                )}
                                {item.customization.selectedColor && (
                                  <>
                                    | Màu:
                                    <span
                                      className="inline-block w-3 h-3 rounded-full ml-1 align-middle"
                                      style={{
                                        backgroundColor:
                                          colorHexMap[
                                            item.customization.selectedColor
                                          ] || "#ccc",
                                        border: "1px solid #bbb",
                                      }}
                                    />
                                  </>
                                )}
                                {item.customization.logoSize && (
                                  <>| Size: {item.customization.selectedSize}</>
                                )}
                              </>
                            ) : (
                              <>
                                {item.product.colors &&
                                  item.product.colors[0]?.color?.hexCode && (
                                    <span
                                      className="inline-block w-3 h-3 rounded-full"
                                      style={{
                                        backgroundColor:
                                          item.product.colors[0].color.hexCode,
                                      }}
                                    />
                                  )}
                              </>
                            )}
                          </span> */}
                          <div className="flex items-center gap-2 mt-1">
                            {item.product.originalPrice >
                              item.product.salePrice && (
                              <span className="text-sm text-[#919EAB] line-through">
                                {item.product.originalPrice.toLocaleString(
                                  "vi-VN",
                                )}
                                đ
                              </span>
                            )}
                            <span className="text-base font-semibold text-[#212B36]">
                              {item.unitPrice.toLocaleString("vi-VN")}đ
                            </span>
                            <span className="text-sm text-[#919EAB]">
                              x{item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6 py-4">
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                      <button
                        onClick={() => handleReorder(order.id)}
                        disabled={reorderLoading === order.id}
                        className={`rounded-2xl w-full sm:w-fit sm:min-w-[120px] px-6 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                          reorderLoading === order.id
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-[#212B36] text-white hover:bg-[#161a22]"
                        }`}
                      >
                        {reorderLoading === order.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <svg
                              width="16"
                              height="16"
                              fill="none"
                              viewBox="0 0 16 16"
                              className="text-white"
                            >
                              <path
                                d="M8 12V8m0 0V4m0 4H4m4 0h4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Mua lại
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => router.push("/cart-checkout")}
                        className="border border-[#212B36] text-[#212B36] rounded-2xl w-full sm:w-fit sm:min-w-[120px] px-6 py-2 text-sm font-medium hover:bg-[#212B36] hover:text-white transition-colors"
                      >
                        Xem giỏ hàng
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-semibold text-[#212B36]">
                        {order.total.toLocaleString("vi-VN")}đ
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.items.length} sản phẩm
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
