import {
  CloseOutlined,
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {Product} from "@app/types";
import {
  removeFromCart,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from "@slices/CartSlice";
import {Button, Drawer, Typography} from "antd";
import Image from "next/image";
import {useRouter} from "next/router";
import React from "react";
import {useDispatch, useSelector} from "react-redux";

interface ShoppingCartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function ShoppingCartDrawer({
  open,
  onClose,
}: ShoppingCartDrawerProps) {
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

  // Helper: map hex code to color name if possible
  function getColorName(product: Product, hex: string) {
    if (Array.isArray(product.colors)) {
      const found = product.colors.find(
        (c: any) => c.color?.hexCode?.toLowerCase() === hex?.toLowerCase(),
      );
      return found?.color?.name || hex;
    }
    return hex;
  }

  return (
    <Drawer
      title={
        <div className="flex justify-between items-center">
          <Typography className="font-semibold text-lg text-[#212B36]">
            Giỏ hàng của bạn
          </Typography>
          <CloseOutlined
            className="cursor-pointer text-[#637381] text-xl m-2"
            onClick={onClose}
          />
        </div>
      }
      closable={false}
      placement="right"
      onClose={onClose}
      open={open}
      width={600}
      className="custom-cart-drawer"
      footer={
        <div className="border-t border-dashed border-[#919EAB3D] pt-6">
          <div className="flex justify-between mb-4">
            <Typography className="font-semibold text-lg text-[#212B36]">
              Tổng
            </Typography>
            <Typography className="font-semibold text-lg text-[#212B36]">
              {total.toLocaleString("vi-VN")}₫
            </Typography>
          </div>
          <div className="flex flex-col gap-2 px-2 pb-4">
            <Button
              onClick={() => router.push("/payment")}
              className="rounded-2xl h-12 py-3 text-[#212B36] bg-[#E1BDA9] hover:!bg-[#CE8A61] hover:!text-[#212B36] hover:!border-none"
            >
              Thanh toán
            </Button>
            <Button
              onClick={() => router.push("/cart-checkout")}
              className="rounded-2xl h-12  py-3 text-[#212B36] hover:!text-[#212B36] hover:!border-[#212B36]"
            >
              Xem giỏ hàng
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <Typography className="text-[#637381]">
              Giỏ hàng của bạn đang trống
            </Typography>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex gap-3 relative">
              <div className="w-[68px] h-[68px] rounded-lg overflow-hidden shrink-0">
                <Image
                  src={item.thumbnailUrl || "/img/home/candles/candle-1.svg"}
                  alt={item.name}
                  width={68}
                  height={68}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <Typography className="font-semibold text-base text-[#212B36]">
                    {item.name}
                  </Typography>
                  <DeleteOutlined
                    className="text-[#637381] cursor-pointer"
                    onClick={() => handleRemoveItem(item.id)}
                  />
                </div>
                <div className="flex items-center mt-2 gap-2">
                  <Button
                    icon={<MinusOutlined />}
                    onClick={() => handleUpdateQuantity(item.id, "decrease")}
                    className="border border-gray-300 !p-0 w-6 h-6 flex items-center justify-center"
                  />
                  <Typography className="text-sm">{item.quantity}</Typography>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => handleUpdateQuantity(item.id, "increase")}
                    className="border border-gray-300 !p-0 w-6 h-6 flex items-center justify-center"
                  />
                </div>
                {/* Hiển thị màu sắc đã chọn */}
                {item.selectedColors && item.selectedColors.length > 0 && (
                  <Typography className="text-sm text-[#637381] mt-1">
                    Màu sắc:
                    <span className="text-[#212B36] ml-1">
                      {item.selectedColors
                        .map((hex) => getColorName(item, hex))
                        .join(", ")}
                    </span>
                  </Typography>
                )}
                <Typography className="text-sm text-[#637381]">
                  Kích thước:
                  <span className="text-[#212B36] ml-1">
                    {item.selectedSize === "SMALL"
                      ? "Nhỏ"
                      : item.selectedSize === "MEDIUM"
                      ? "Vừa"
                      : item.selectedSize === "LARGE"
                      ? "Lớn"
                      : item.selectedSize || "Không xác định"}
                  </span>
                </Typography>
              </div>
              <div className="absolute bottom-0 right-0 text-sm text-[#212B36] font-semibold">
                {item.originalPrice > item.salePrice && (
                  <span className="text-sm text-[#637381] line-through mr-1 font-semibold">
                    {item.originalPrice.toLocaleString("vi-VN")}₫
                  </span>
                )}
                {item.salePrice.toLocaleString("vi-VN")}₫
              </div>
            </div>
          ))
        )}
      </div>
    </Drawer>
  );
}
