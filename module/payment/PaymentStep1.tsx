import {
  Address2FormData,
  addressValidationSchema,
} from "./validation/addressSchema";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {yupResolver} from "@hookform/resolvers/yup";
import {selectCartItems, selectCartTotal} from "@slices/CartSlice";
import {
  AddressInfo,
  selectAddressInfo,
  selectOrderSummary,
  setAddressInfo,
  setOrderSummary,
} from "@slices/PaymentSlice";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";

export interface IPaymentProps {
  changeTab: (tab: string) => void;
}

export default function PaymentStep1({changeTab}: IPaymentProps) {
  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const addressInfo = useSelector(selectAddressInfo);
  const orderSummary = useSelector(selectOrderSummary);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<Address2FormData>({
    resolver: yupResolver(addressValidationSchema),
    defaultValues: {
      fullName: addressInfo.fullName || "",
      phone: addressInfo.phone || "",
      country: "Vietnam",
      address: addressInfo.address || "",
      isDefault: addressInfo.isDefault || false,
    },
  });

  // Reset form when addressInfo changes
  useEffect(() => {
    reset({
      fullName: addressInfo.fullName || "",
      phone: addressInfo.phone || "",
      country: "Vietnam",
      address: addressInfo.address || "",
      isDefault: addressInfo.isDefault || false,
    });
  }, [addressInfo, reset]);

  // Calculate order summary from cart data
  useEffect(() => {
    const subtotal = cart.reduce(
      (sum, item) =>
        sum + (Number(item.salePrice) || 0) * (Number(item.quantity) || 0),
      0,
    );
    const savings = subtotal - cartTotal;
    const discountPercentage =
      subtotal > 0 ? Math.round((savings / subtotal) * 100) : 0;

    dispatch(
      setOrderSummary({
        subtotal,
        discount: savings,
        discountPercentage,
        total: cartTotal,
        shippingFee: 0,
        finalTotal: cartTotal,
      }),
    );
  }, [cart, cartTotal, dispatch]);

  const onSubmit = (data: Address2FormData) => {
    // Save to Redux store
    dispatch(setAddressInfo(data as AddressInfo));
    // Move to next step
    changeTab("paymentStep2");
  };
  return (
    <div className="flex flex-col lg:flex-row gap-8 justify-between w-full max-w-6xl mx-auto py-8">
      {/* Left: Address Form & Address List */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Address Form */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Địa chỉ</h2>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  {...register("fullName")}
                  placeholder="Họ tên"
                  className={`border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  {...register("phone")}
                  placeholder="Điện thoại"
                  className={`border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <input
                type="text"
                {...register("address")}
                placeholder="Địa chỉ chi tiết"
                className={`border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.address ? "border-red-500" : ""
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="defaultAddress"
                {...register("isDefault")}
                className="accent-primary"
              />
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="defaultAddress" className="text-sm">
                Sử dụng địa chỉ này làm mặc định
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="submit"
                className="bg-[#FF8E1A] text-white px-6 py-2 rounded-lg "
              >
                Gửi đến địa chỉ này
              </button>
              <button
                type="button"
                className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>

        <button className="flex items-center gap-2 text-gray-600 text-sm mt-2 hover:underline w-fit">
          <ArrowLeftOutlined />
          Quay lại
        </button>
      </div>
      {/* Right: Order Summary */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-white rounded-xl shadow p-6 mb-4">
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
          <div className="border-t pt-3 flex justify-between font-semibold text-base">
            <span>Tổng cộng</span>
            <span className="text-red-500">
              {orderSummary.total.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
