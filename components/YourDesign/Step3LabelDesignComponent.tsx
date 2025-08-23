import {ArrowLeftOutlined, ArrowRightOutlined} from "@ant-design/icons";
import {Button, Col, Input, Progress, Row, Typography} from "antd";
import clsx from "clsx";
import Image from "next/image";
import React from "react";
import {FiUploadCloud} from "react-icons/fi";

interface Step3LabelDesignProps {
  title: string;
  setTitle: (title: string) => void;
  uploadedImage: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logoSize: "M" | "L";
  setLogoSize: (size: "M" | "L") => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step3LabelDesignComponent({
  title,
  setTitle,
  uploadedImage,
  handleImageUpload,
  logoSize,
  setLogoSize,
  onBack,
  onNext,
}: Step3LabelDesignProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-2 px-2">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className="text-[#212B36] text-sm font-medium hover:!text-black"
        >
          Quay lại
        </Button>
        <Button
          type="text"
          icon={<ArrowRightOutlined />}
          iconPosition="end"
          onClick={onNext}
          className="text-[#212B36] text-sm font-medium hover:!text-black"
        >
          Tiếp theo
        </Button>
      </div>

      <div className="text-center">
        <Typography className="text-xl md:text-2xl text-[#212B36] font-bold mb-2">
          Thiết kế của riêng bạn
        </Typography>
        <Typography className="text-[#212B36] mb-2 text-lg">
          Chọn thiết kế nhãn
        </Typography>
        <Progress
          percent={100}
          showInfo={false}
          strokeColor="#e7a87b"
          trailColor="#f5e2d8"
          size={4}
          className="mb-2"
        />
        <Typography className="text-base text-[#637381] mb-4">3/3</Typography>
      </div>

      <div className="mb-6">
        <Typography className="text-base font-semibold text-[#212B36] mb-4">
          1 Nhập tiêu đề
        </Typography>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="TRANH CỦA BẠN..."
          className={clsx(
            "rounded-2xl px-4 py-2 font-semibold text-sm",
            title
              ? "text-[#161C24] border-[#212B36] hover:!border-[#161C24]"
              : "text-[#8B95A1] border-[#919EAB52] hover:!border-[#919EAB52]",
          )}
        />
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} md={16}>
          <Typography className="text-base font-semibold text-[#212B36] mb-4">
            2 Tải lên logo
          </Typography>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              id="upload"
              hidden
            />
            <Button
              onClick={() => document.getElementById("upload")?.click()}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-gray-900 text-gray-900 bg-white hover:!bg-gray-900 hover:!text-white hover:!border-black transition-all duration-200"
            >
              Chọn hình ảnh
              <FiUploadCloud className="text-lg" />
            </Button>
            {uploadedImage && (
              <div className="relative border border-dashed border-[#ccc] rounded-xl w-[112px] h-[112px] overflow-hidden">
                <Image
                  src={uploadedImage}
                  alt="Logo preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </Col>
        <Col xs={24} md={8}>
          <Typography className="text-base font-semibold text-[#212B36] mb-4">
            3 Kích thước logo
          </Typography>
          <div className="flex gap-2 mt-2">
            {["M", "L"].map((size) => (
              <button
                key={size}
                onClick={() => setLogoSize(size as "M" | "L")}
                className={clsx(
                  "rounded-full px-3 py-1 text-sm border transition",
                  logoSize === size
                    ? "bg-gray-900 text-white"
                    : "bg-[#F4F6F8] text-[#637381]",
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </Col>
      </Row>

      <Button
        type="primary"
        size="large"
        className="w-full h-[48px] bg-gray-900 text-white text-base font-medium rounded-xl hover:!bg-black"
        onClick={onNext}
      >
        Tiếp theo
      </Button>
    </>
  );
}
