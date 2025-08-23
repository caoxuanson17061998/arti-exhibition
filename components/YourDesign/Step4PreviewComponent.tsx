import "./index.scss";
import {
  ArrowLeftOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {Button, Checkbox, Divider, Tag, Tooltip, Typography} from "antd";
import clsx from "clsx";
import Image from "next/image";
import React from "react";

interface Step4PreviewProps {
  selectedColor: string;
  selectedColorImage: string;
  selectedScents: string[];
  title: string;
  logoSize: "Vừa" | "Lớn";
  onBack: () => void;
  quantity: number;
  onQuantityChange: (q: number) => void;
  onSubmit: () => void;
  approved: boolean;
  onApproveChange: (checked: boolean) => void;
  submitting: boolean;
  baseProduct: any;
}

export function Step4PreviewComponent({
  selectedColor,
  selectedColorImage,
  selectedScents,
  title,
  logoSize,
  onBack,
  quantity,
  onQuantityChange,
  onSubmit,
  approved,
  onApproveChange,
  submitting,
  baseProduct,
}: Step4PreviewProps) {
  // Calculate pricing breakdown
  const basePrice = baseProduct?.salePrice || 320000;
  const logoSizeFees = {Vừa: 0, Lớn: 80000};
  const logoSizeFee = logoSizeFees[logoSize] || 0;
  const additionalScentFee = 0;
  const customImageFee = 0; // Will be added when image upload is implemented

  const totalExtraFees = logoSizeFee + additionalScentFee + customImageFee;
  const unitPrice = basePrice + totalExtraFees;
  const totalPrice = unitPrice * quantity;

  return (
    <>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={onBack}
        className="text-[#212B36] text-sm font-medium hover:!text-black mb-2"
        disabled={submitting}
      >
        Quay lại
      </Button>
      <Typography className="text-center text-xl md:text-2xl text-[#212B36] font-bold mb-4">
        Xem trước và phê duyệt
      </Typography>

      <div className="mb-6">
        <Typography className="text-base font-semibold text-[#212B36] mb-4">
          1. Màu sản phẩm
        </Typography>
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
            <Image
              src={selectedColorImage}
              alt={selectedColor}
              fill
              className="object-cover"
            />
          </div>
          <Typography className="text-[#212B36] text-base">
            {selectedColor}
          </Typography>
        </div>
      </div>

      <div className="mb-6">
        <Typography className="text-base font-semibold text-[#212B36] mb-4">
          2. Mùi hương
        </Typography>
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedScents.map((scent) => (
            <Tag
              key={scent}
              className="bg-[#E1BDA929] text-[#D38B65] border-none rounded-md px-3 py-1"
            >
              {scent}
            </Tag>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <Typography className="text-base font-semibold text-[#212B36] mb-4">
          3. Nhãn thiết kế
        </Typography>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between">
            <Typography className="text-[#637381] text-base">
              Nội dung:
            </Typography>
            <Typography className="text-[#212B36] text-base">
              {title || "Không có"}
            </Typography>
          </div>
          <div className="flex justify-between items-center">
            <Typography className="text-[#637381] text-base">
              Kích thước logo:
            </Typography>
            <div className="flex items-center gap-2">
              <Typography className="text-[#212B36] text-base">
                {logoSize}
              </Typography>
              {logoSizeFee > 0 && (
                <Tooltip title="Phí cho kích thước logo lớn hơn">
                  <span className="text-sm text-green-600">
                    +{logoSizeFee.toLocaleString()}đ
                  </span>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <Typography className="text-base font-semibold text-[#212B36] mb-3">
          Chi tiết giá
        </Typography>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#637381]">Giá cơ bản:</span>
            <span className="text-[#212B36]">
              {basePrice.toLocaleString()}đ
            </span>
          </div>

          {logoSizeFee > 0 && (
            <div className="flex justify-between">
              <span className="text-[#637381]">
                Phí kích thước logo ({logoSize}):
              </span>
              <span className="text-green-600">
                +{logoSizeFee.toLocaleString()}đ
              </span>
            </div>
          )}

          <Divider className="my-2" />

          <div className="flex justify-between font-medium">
            <span className="text-[#212B36]">Đơn giá:</span>
            <span className="text-[#212B36]">
              {unitPrice.toLocaleString()}đ
            </span>
          </div>

          <div className="flex justify-between font-medium">
            <span className="text-[#212B36]">Số lượng:</span>
            <span className="text-[#212B36]">x{quantity}</span>
          </div>
        </div>
      </div>

      <Typography className="text-2xl font-bold text-[#212B36] mb-4">
        {totalPrice.toLocaleString()}đ
      </Typography>

      <Checkbox
        checked={approved}
        onChange={(e) => onApproveChange(e.target.checked)}
        className="custom-checkbox"
        disabled={submitting}
      >
        Tôi đã xem xét và chấp thuận thiết kế của mình.
      </Checkbox>

      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center border border-gray-300 rounded-xl h-[48px] px-2">
          <Button
            type="text"
            icon={<MinusOutlined />}
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="h-full w-[48px] flex items-center justify-center text-xl text-[#161C24]"
            disabled={submitting}
          />
          <span className="w-10 text-center text-base font-medium text-[#161C24]">
            {quantity}
          </span>
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={() => onQuantityChange(quantity + 1)}
            className="h-full w-[48px] flex items-center justify-center text-xl text-[#161C24]"
            disabled={submitting}
          />
        </div>

        <Button
          type="primary"
          size="large"
          className={clsx("w-full h-[48px] text-base font-medium rounded-xl", {
            "bg-gray-900 text-white hover:!bg-black": approved && !submitting,
            "bg-gray-300 text-white cursor-not-allowed":
              !approved || submitting,
          })}
          onClick={onSubmit}
          disabled={!approved || submitting}
          loading={submitting}
        >
          {submitting ? "Đang xử lý..." : "Thêm vào giỏ hàng"}
        </Button>
      </div>
    </>
  );
}
