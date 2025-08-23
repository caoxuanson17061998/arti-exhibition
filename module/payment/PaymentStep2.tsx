import {
  PaymentFormData,
  paymentValidationSchema,
} from "./validation/paymentSchema";
import {ArrowLeftOutlined, EditOutlined} from "@ant-design/icons";
import IconPayment from "@components/Icon/IconPayment";
import VietQR from "@components/VietQR";
import {yupResolver} from "@hookform/resolvers/yup";
import {clearCart, selectCartItems} from "@slices/CartSlice";
import {
  selectAddressInfo,
  selectOrderSummary,
  selectPaymentMethod,
  selectShippingMethod,
  setOrderSummary,
  setPaymentMethod,
  setShippingMethod,
} from "@slices/PaymentSlice";
import {bankInformation} from "@utils/constants/bankInfomation";
import {notification} from "antd";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";

// Define types for better type safety
interface CartItem {
  id: string;
  name: string;
  slug?: string;
  productSlug?: string;
  thumbnailUrl: string;
  quantity: number;
  salePrice: number;
  selectedColors?: string[];
  selectedScents?: string[];
  selectedSize?: string;
  customization?: {
    isCustomProduct: boolean;
    baseProductId: string;
  };
}

interface User {
  user: {
    id: string;
    email?: string;
    name?: string;
  };
}

interface RootState {
  user: User;
}

export interface IPaymentProps {
  changeTab: (tab: string) => void;
}

// Helper function to calculate shipping fee based on address and weight
const calculateShippingFee = (
  shippingMethod: "standard" | "express",
  isInnerCity: boolean,
  totalWeight: number,
): number => {
  if (shippingMethod === "standard") {
    // Standard delivery pricing
    if (totalWeight <= 1) {
      return isInnerCity ? 30000 : 40000; // Nội thành 30k, ngoại thành 40k
    }
    // Weight-based pricing for >1kg
    const basePrice = isInnerCity ? 30000 : 40000;
    const extraWeight = totalWeight - 1;
    const extraFee = Math.ceil(extraWeight) * (isInnerCity ? 15000 : 20000); // Phí thêm theo kg
    return basePrice + extraFee;
  }
  // Express delivery via Grab - tùy trường hợp
  // For now, we'll use a base calculation but note it's case-by-case
  const baseFee = isInnerCity ? 50000 : 70000;
  if (totalWeight > 1) {
    const extraWeight = totalWeight - 1;
    const extraFee = Math.ceil(extraWeight) * (isInnerCity ? 20000 : 30000);
    return baseFee + extraFee;
  }
  return baseFee;
};

// Helper function to get delivery date estimate
const getDeliveryEstimate = (
  shippingMethod: "standard" | "express",
): string => {
  const today = new Date();

  if (shippingMethod === "standard") {
    // 3-4 ngày
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 4);

    return `${minDate.toLocaleDateString(
      "vi-VN",
    )} - ${maxDate.toLocaleDateString("vi-VN")}`;
  }
  // Grab express - tùy trường hợp, ước tính trong ngày hoặc ngày mai
  const deliveryDate = new Date(today);
  const currentHour = today.getHours();

  if (currentHour < 14) {
    // Nếu đặt trước 14h, có thể giao trong ngày
    return `Trong ngày (tùy tình hình Grab)`;
  }
  // Nếu đặt sau 14h, giao ngày mai
  deliveryDate.setDate(today.getDate() + 1);
  return `${deliveryDate.toLocaleDateString("vi-VN")} (tùy tình hình Grab)`;
};

// Helper function to estimate total weight of cart items
const estimateCartWeight = (cartItems: CartItem[]): number => {
  // Estimate weight based on product type
  // Nến thơm trung bình ~0.4kg mỗi cái
  return cartItems.reduce((total, item) => {
    const itemWeight = 0.4; // kg per candle
    return total + itemWeight * item.quantity;
  }, 0);
};

// Helper function to determine if address is inner city
const isInnerCityAddress = (
  address: string,
  province?: string,
  district?: string,
): boolean => {
  if (!address) return true; // Default to inner city if no address

  const innerCityKeywords = [
    "quận",
    "district",
    "q.",
    "q ",
    "ba đình",
    "hoàn kiếm",
    "hai bà trưng",
    "đống đa",
    "tây hồ",
    "cầu giấy",
    "thanh xuân",
    "hoàng mai",
    "long biên",
    "bắc từ liêm",
    "nam từ liêm",
    "hà đông",
    "quận 1",
    "quận 2",
    "quận 3",
    "quận 4",
    "quận 5",
    "quận 6",
    "quận 7",
    "quận 8",
    "quận 9",
    "quận 10",
    "quận 11",
    "quận 12",
    "thủ đức",
    "bình thạnh",
    "gò vấp",
    "phú nhuận",
    "tân bình",
    "tân phú",
    "bình tân",
  ];

  const addressLower = address.toLowerCase();
  const provinceLower = province?.toLowerCase() || "";
  const districtLower = district?.toLowerCase() || "";

  return innerCityKeywords.some(
    (keyword) =>
      addressLower.includes(keyword) ||
      districtLower.includes(keyword) ||
      provinceLower.includes(keyword),
  );
};

export default function PaymentStep2({changeTab}: IPaymentProps) {
  const dispatch = useDispatch();
  const addressInfo = useSelector(selectAddressInfo);
  const orderSummary = useSelector(selectOrderSummary);
  const selectedShippingMethod = useSelector(selectShippingMethod);
  const selectedPaymentMethod = useSelector(selectPaymentMethod);
  const cartItems = useSelector(selectCartItems) as CartItem[];
  const user = useSelector((state: RootState) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentShippingFee, setCurrentShippingFee] = useState(0);
  const router = useRouter();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {errors},
  } = useForm<PaymentFormData>({
    resolver: yupResolver(paymentValidationSchema),
    defaultValues: {
      shippingMethod: selectedShippingMethod,
      paymentMethod: selectedPaymentMethod,
    },
  });

  const watchedShippingMethod = watch("shippingMethod");
  const watchedPaymentMethod = watch("paymentMethod");

  // Calculate shipping fee when shipping method or address changes
  useEffect(() => {
    if (cartItems && cartItems.length > 0 && addressInfo.address) {
      const totalWeight = estimateCartWeight(cartItems);
      const isInner = isInnerCityAddress(
        addressInfo.address,
        addressInfo.province,
        addressInfo.district,
      );
      const shippingFee = calculateShippingFee(
        watchedShippingMethod || "standard",
        isInner,
        totalWeight,
      );

      setCurrentShippingFee(shippingFee);

      // Update order summary with new shipping fee
      const updatedOrderSummary = {
        ...orderSummary,
        shippingFee,
        finalTotal: orderSummary.total + shippingFee,
      };

      dispatch(setOrderSummary(updatedOrderSummary));
    }
  }, [
    watchedShippingMethod,
    addressInfo,
    cartItems,
    orderSummary.total,
    dispatch,
  ]);

  // Update Redux when form values change
  useEffect(() => {
    if (watchedShippingMethod) {
      dispatch(
        setShippingMethod(watchedShippingMethod as "standard" | "express"),
      );
    }
  }, [watchedShippingMethod, dispatch]);

  useEffect(() => {
    if (watchedPaymentMethod) {
      dispatch(
        setPaymentMethod(watchedPaymentMethod as "cod" | "online" | "vietqr"),
      );
    }
  }, [watchedPaymentMethod, dispatch]);

  // Update form when Redux state changes
  useEffect(() => {
    setValue("shippingMethod", selectedShippingMethod);
    setValue("paymentMethod", selectedPaymentMethod);
  }, [selectedShippingMethod, selectedPaymentMethod, setValue]);

  const onSubmit = async (data: PaymentFormData) => {
    if (isSubmitting) return;

    // Check if user is logged in
    if (!user?.user?.id) {
      notification.error({
        message: "Vui lòng đăng nhập để đặt hàng",
        description: "Bạn cần đăng nhập để có thể đặt hàng",
      });
      router.push("/login");
      return;
    }

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      notification.error({
        message: "Giỏ hàng trống",
        description: "Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng",
      });
      router.push("/products");
      return;
    }

    // Validate address info
    if (!addressInfo.fullName || !addressInfo.phone || !addressInfo.address) {
      notification.error({
        message: "Thông tin địa chỉ chưa đầy đủ",
        description: "Vui lòng kiểm tra lại thông tin địa chỉ giao hàng",
      });
      changeTab("paymentStep1");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        customerName: addressInfo.fullName,
        customerPhone: addressInfo.phone,
        customerEmail: user.user.email || "",
        shippingAddress: `${addressInfo.address}, ${addressInfo.ward || ""}, ${
          addressInfo.district || ""
        }, ${addressInfo.province || ""}, ${addressInfo.country || "Vietnam"}`
          .replace(/,\s*,/g, ",")
          .replace(/^,\s*|,\s*$/g, ""),
        subtotal: orderSummary.subtotal,
        discount: orderSummary.discount,
        discountPercentage: orderSummary.discountPercentage,
        shippingFee: currentShippingFee,
        total: orderSummary.finalTotal,
        shippingMethod: data.shippingMethod,
        paymentMethod: data.paymentMethod,
        userId: user.user.id,
        items: cartItems.map((item) => ({
          productId: item.customization?.isCustomProduct
            ? item.customization.baseProductId
            : item.id,
          productName: item.name,
          productSlug: item.productSlug || item.slug,
          productImage: item.thumbnailUrl,
          quantity: item.quantity,
          unitPrice: item.salePrice,
          totalPrice: item.salePrice * item.quantity,
          selectedColors: item.selectedColors || [],
          selectedSize: item.selectedSize || null,
          customization: item.customization || null,
        })),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        // Clear cart after successful order
        dispatch(clearCart());

        if (data.paymentMethod === "vietqr") {
          notification.success({
            message: "Đặt hàng thành công!",
            description: `Mã đơn hàng: ${result.data.orderNumber}. Vui lòng hoàn tất thanh toán qua VietQR để đơn hàng được xử lý.`,
            duration: 8,
          });
        } else {
          notification.success({
            message: "Đặt hàng thành công!",
            description: `Mã đơn hàng: ${result.data.orderNumber}`,
          });
        }

        // Redirect to order history
        router.push("/history");
      } else {
        notification.error({
          message: "Đặt hàng thất bại",
          description: result.message || "Có lỗi xảy ra khi đặt hàng",
        });
      }
    } catch (error) {
      notification.error({
        message: "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get delivery estimates
  const standardDelivery = getDeliveryEstimate("standard");
  const expressDelivery = getDeliveryEstimate("express");

  // Get weight info for display
  const totalWeight = cartItems ? estimateCartWeight(cartItems) : 0;
  const isInner = isInnerCityAddress(
    addressInfo.address,
    addressInfo.province,
    addressInfo.district,
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 justify-between w-full max-w-6xl mx-auto py-8">
      {/* Left: Shipping & Payment Method */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Shipping Method */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-2">Hình thức vận chuyển</h2>

          {/* Weight and location info */}
          <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <div>📦 Trọng lượng ước tính: ~{totalWeight.toFixed(1)} kg</div>
            <div>📍 Khu vực: {isInner ? "Nội thành" : "Ngoại thành"}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <label
              htmlFor="shipping-standard"
              className={`flex-1 border rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer ${
                watchedShippingMethod === "standard"
                  ? "ring-2 ring-green-500 bg-green-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <input
                id="shipping-standard"
                type="radio"
                value="standard"
                {...register("shippingMethod")}
                className="sr-only"
              />
              <span
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  watchedShippingMethod === "standard"
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full block ${
                    watchedShippingMethod === "standard"
                      ? "bg-green-500"
                      : "bg-white"
                  }`}
                />
              </span>
              <div className="text-left">
                <div className="font-medium">
                  Giao hàng tiêu chuẩn (
                  {calculateShippingFee(
                    "standard",
                    isInner,
                    totalWeight,
                  ).toLocaleString()}
                  ₫)
                </div>
                <div className="text-xs text-gray-500">
                  Dự kiến giao: {standardDelivery}
                </div>
                {totalWeight > 1 && (
                  <div className="text-xs text-blue-600">
                    Phí tăng theo trọng lượng ({totalWeight.toFixed(1)} kg)
                  </div>
                )}
              </div>
            </label>

            <label
              htmlFor="shipping-express"
              className={`flex-1 border rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer ${
                watchedShippingMethod === "express"
                  ? "ring-2 ring-green-500 bg-green-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <input
                id="shipping-express"
                type="radio"
                value="express"
                {...register("shippingMethod")}
                className="sr-only"
              />
              <span
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  watchedShippingMethod === "express"
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full block ${
                    watchedShippingMethod === "express"
                      ? "bg-green-500"
                      : "bg-white"
                  }`}
                />
              </span>
              <div className="text-left">
                <div className="font-medium">
                  Giao hàng nhanh - Grab (
                  {calculateShippingFee(
                    "express",
                    isInner,
                    totalWeight,
                  ).toLocaleString()}
                  ₫)
                </div>
                <div className="text-xs text-gray-500">
                  Dự kiến: {expressDelivery}
                </div>
                <div className="text-xs text-orange-600">
                  ⚠️ Tùy tình hình Grab tại thời điểm đặt hàng
                </div>
              </div>
            </label>
          </div>
          {errors.shippingMethod && (
            <p className="text-red-500 text-xs mt-2">
              {errors.shippingMethod.message}
            </p>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Phương thức thanh toán</h2>
          <div className="space-y-3">
            <label
              htmlFor="payment-cod"
              className={`w-full border border-gray-300 rounded-lg py-3 px-4 flex gap-3 items-center cursor-pointer hover:bg-gray-50 transition ${
                watchedPaymentMethod === "cod"
                  ? "ring-2 ring-green-500 bg-green-50"
                  : ""
              }`}
            >
              <input
                id="payment-cod"
                type="radio"
                value="cod"
                {...register("paymentMethod")}
                className="sr-only"
              />
              <span
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  watchedPaymentMethod === "cod"
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full block ${
                    watchedPaymentMethod === "cod" ? "bg-green-500" : "bg-white"
                  }`}
                />
              </span>
              <IconPayment />
              <span className="text-gray-700">
                Thanh toán khi nhận hàng (COD)
              </span>
            </label>

            <label
              htmlFor="payment-vietqr"
              className={`w-full border border-gray-300 rounded-lg py-3 px-4 flex gap-3 items-center cursor-pointer hover:bg-gray-50 transition ${
                watchedPaymentMethod === "vietqr"
                  ? "ring-2 ring-green-500 bg-green-50"
                  : ""
              }`}
            >
              <input
                id="payment-vietqr"
                type="radio"
                value="vietqr"
                {...register("paymentMethod")}
                className="sr-only"
              />
              <span
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                  watchedPaymentMethod === "vietqr"
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full block ${
                    watchedPaymentMethod === "vietqr"
                      ? "bg-green-500"
                      : "bg-white"
                  }`}
                />
              </span>
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                QR
              </div>
              <span className="text-gray-700">Chuyển khoản qua VietQR</span>
            </label>
          </div>
          {errors.paymentMethod && (
            <p className="text-red-500 text-xs mt-2">
              {errors.paymentMethod.message}
            </p>
          )}
        </div>

        <button
          className="flex items-center gap-2 text-gray-600 text-sm mt-2 hover:underline w-fit"
          onClick={() => changeTab("paymentStep1")}
        >
          <ArrowLeftOutlined />
          Quay lại
        </button>
      </div>

      {/* Right: Address & Order Summary */}
      <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
        {/* Address */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 relative">
          <div
            className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => changeTab("paymentStep1")}
            role="presentation"
          >
            <EditOutlined />
          </div>
          <h3 className="font-semibold text-base mb-1">Địa chỉ giao hàng</h3>
          <div className="font-medium">
            {addressInfo.fullName || user?.user?.name || "Chưa có thông tin"}
          </div>
          <div className="text-sm text-gray-700">
            {addressInfo.address || "Chưa có địa chỉ"}
          </div>
          {addressInfo.ward && (
            <div className="text-sm text-gray-500">
              {addressInfo.ward}, {addressInfo.district}, {addressInfo.province}
            </div>
          )}
          <div className="text-sm text-gray-500">
            {addressInfo.phone || "Chưa có số điện thoại"}
          </div>
          {user?.user?.email && (
            <div className="text-sm text-gray-500">{user.user.email}</div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Tóm tắt đơn hàng</h2>
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Tổng phụ</span>
            <span>{orderSummary.subtotal.toLocaleString("vi-VN")}₫</span>
          </div>
          {orderSummary.discount > 0 && (
            <div className="flex justify-between mb-2 text-green-600">
              <span>Giảm giá ({orderSummary.discountPercentage}%)</span>
              <span>-{orderSummary.discount.toLocaleString("vi-VN")}₫</span>
            </div>
          )}
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Phí vận chuyển</span>
            <span>
              {currentShippingFee > 0
                ? `${currentShippingFee.toLocaleString("vi-VN")}₫`
                : "Miễn phí"}
            </span>
          </div>
          <div className="border-t pt-3 flex justify-between font-semibold text-base">
            <span>Tổng cộng</span>
            <span className="text-red-500">
              {orderSummary.finalTotal.toLocaleString("vi-VN")}₫
            </span>
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            type="button"
            disabled={isSubmitting}
            className={`w-full mt-4 py-2 rounded-lg transition font-semibold ${
              isSubmitting
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-[#C7A17A] text-white hover:bg-[#b08a5a]"
            }`}
          >
            {isSubmitting ? "Đang xử lý..." : "Hoàn tất đơn hàng"}
          </button>
        </div>

        {/* VietQR Payment Display */}
        {watchedPaymentMethod === "vietqr" && (
          <VietQR
            bankCode={bankInformation.bankCode}
            bankAccount={bankInformation.bankAccount}
            accountName={bankInformation.accountName}
            amount={orderSummary.finalTotal}
            orderNumber={`ORDER-${Date.now()}`}
            memo="Thanh toan don hang art exhibition"
          />
        )}
      </div>
    </div>
  );
}
