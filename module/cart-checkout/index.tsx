import {
  removeFromCart,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from "../../redux/slices/CartSlice";
import {setOrderSummary} from "../../redux/slices/PaymentSlice";
import Config from "@app/config";
import {useRouter} from "next/router";
import React from "react";
import {useDispatch, useSelector} from "react-redux";

export function CartCheckout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const handleUpdateQuantity = (id: string, type: "increase" | "decrease") => {
    dispatch(updateQuantity({id, type}));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  // Tính tổng phụ (subtotal) trước khi giảm giá
  const subtotal = cart.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0,
  );

  // Tính số tiền tiết kiệm
  const savings = subtotal - total;

  // Tính phần trăm giảm giá
  const discountPercentage =
    subtotal > 0 ? Math.round((savings / subtotal) * 100) : 0;

  const handleCheckout = () => {
    // Save order summary to Redux before navigating to payment
    dispatch(
      setOrderSummary({
        subtotal,
        discount: savings,
        discountPercentage,
        total,
        shippingFee: 0,
        finalTotal: total,
      }),
    );
    router.push(Config.PATHNAME.PAYMENT);
  };

  return (
    <div className="w-full bg-white pb-[20vh] flex justify-center items-start py-8 px-2 md:px-0">
      <div className="w-full justify-center flex flex-col md:flex-row gap-6 container">
        {/* Đơn hàng */}
        <div className="w-full">
          <div className="mb-10 font-bold text-2xl">Giỏ hàng</div>
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4">Đơn hàng</h2>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Giỏ hàng của bạn đang trống
                </p>
                <button
                  type="button"
                  onClick={() => router.push(Config.PATHNAME.HOME)}
                  className="bg-[#D2B6A1] hover:bg-[#c2a48e] text-white font-semibold rounded-lg px-6 py-2 transition"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto w-full">
                  <table className="w-full min-w-[350px]">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-sm">
                        <th className="font-medium text-left p-2 md:p-3">
                          Sản phẩm
                        </th>
                        <th className="font-medium text-center p-2 md:p-3">
                          Giá
                        </th>
                        <th className="font-medium text-center p-2 md:p-3">
                          Số lượng
                        </th>
                        <th className="font-medium text-center p-2 md:p-3">
                          Tổng
                        </th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id} className="border-b last:border-b-0">
                          <td className="flex items-center gap-3 p-2 md:p-3">
                            <img
                              src={
                                item.thumbnailUrl ||
                                "/img/home/candles/candle-1.svg"
                              }
                              alt={item.name}
                              className="w-14 h-14 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-semibold text-sm md:text-base">
                                {item.name}
                              </div>
                              <div className="text-xs text-gray-500 space-y-1">
                                {item.selectedColors &&
                                  item.selectedColors.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      Màu: {item.selectedColors.join(", ")}
                                    </div>
                                  )}
                                <div>
                                  Kích thước:{" "}
                                  {item.selectedSize === "SMALL"
                                    ? "Nhỏ"
                                    : item.selectedSize === "MEDIUM"
                                    ? "Vừa"
                                    : item.selectedSize === "LARGE"
                                    ? "Lớn"
                                    : item.selectedSize || "Không xác định"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center text-sm md:text-base p-2 md:p-3">
                            <div className="flex flex-col items-center">
                              {item.originalPrice > item.salePrice && (
                                <span className="text-xs text-gray-400 line-through">
                                  {item.originalPrice.toLocaleString("vi-VN")}₫
                                </span>
                              )}
                              <span className="font-semibold">
                                {item.salePrice.toLocaleString("vi-VN")}₫
                              </span>
                            </div>
                          </td>
                          <td className="text-center p-2 md:p-3">
                            <div className="flex items-center justify-center gap-2 border rounded-md w-fit mx-auto px-2 py-1">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateQuantity(item.id, "decrease")
                                }
                                className="text-lg font-bold text-gray-400 hover:text-gray-600"
                              >
                                -
                              </button>
                              <span className="mx-1">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateQuantity(item.id, "increase")
                                }
                                className="text-lg font-bold text-gray-700 hover:text-gray-900"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="text-center text-sm md:text-base p-2 md:p-3 font-semibold">
                            {(item.salePrice * item.quantity).toLocaleString(
                              "vi-VN",
                            )}
                            ₫
                          </td>
                          <td className="text-center p-2 md:p-3">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <svg
                                width="20"
                                height="20"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  d="M6 6l12 12M6 18L18 6"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={() => router.push(Config.PATHNAME.HOME)}
                  className="mt-6 flex items-center gap-2 text-sm text-gray-700 hover:underline"
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Tiếp tục mua sắm
                </button>
              </>
            )}
          </div>
        </div>
        {/* Sidebar: Tóm tắt đơn hàng & Khuyến mãi */}
        {cart.length > 0 && (
          <div className="w-full md:w-[340px] flex flex-col gap-4  md:mt-[70px]">
            {/* Tóm tắt đơn hàng */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
              <h3 className="font-bold text-base md:text-lg mb-4">
                Tóm tắt đơn hàng
              </h3>
              <div className="flex justify-between text-sm mb-2">
                <span>Tổng phụ</span>
                <span className="font-semibold">
                  {subtotal.toLocaleString("vi-VN")}₫
                </span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-sm mb-2 text-green-600">
                  <span>Tiết kiệm ({discountPercentage}%)</span>
                  <span className="font-semibold">
                    -{savings.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              )}
              <div className="border-t my-2" />
              <div className="flex justify-between items-center text-base font-bold mb-4">
                <span>Tổng cộng</span>
                <span className="text-[#E04A3F]">
                  {total.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <button
                onClick={handleCheckout}
                type="button"
                className="w-full bg-[#D2B6A1] hover:bg-[#c2a48e] text-white font-semibold rounded-lg py-2 text-base transition"
              >
                Thanh toán
              </button>
            </div>
            {/* Khuyến mãi */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
              <h4 className="font-bold text-base mb-2">Khuyến mại</h4>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Mã khuyến mại"
                  className="flex-1 border rounded-lg px-3 py-1 text-sm flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#D2B6A1]"
                />
                <button
                  type="button"
                  className="bg-[#D2B6A1] hover:bg-[#c2a48e] flex-shrink-0 text-white font-semibold rounded-lg px-4 py-2 text-sm transition"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
