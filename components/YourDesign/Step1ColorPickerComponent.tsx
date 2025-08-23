import {ArrowRightOutlined} from "@ant-design/icons";
import {COLOR_CANDLE_OPTIONS} from "@app/constants";
import {Button, Progress, Radio, Typography} from "antd";
import Image from "next/image";
import React from "react";

interface Color {
  id: string;
  name: string;
  hexCode: string;
}

interface Step1ColorPickerProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  onNext: () => void;
  availableColors: Color[];
}

// Hàm chuyển tên màu sang camelCase không dấu
function toCamelCaseNoAccent(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .split(/\s+/)
    .map((w, i) =>
      i === 0
        ? w.toLowerCase()
        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
    )
    .join("");
}

export function Step1ColorPickerComponent({
  selectedColor,
  setSelectedColor,
  onNext,
  availableColors,
}: Step1ColorPickerProps) {
  // Map database colors to display format
  const getColorOptions = () => {
    if (availableColors.length === 0) {
      return COLOR_CANDLE_OPTIONS; // Fallback to constants if no database data
    }

    // Filter chỉ lấy 6 màu mong muốn
    const allowedNames = [
      "Dusty Rose",
      "Powder Blue",
      "Blush Pink",
      "Mint Green",
      "Charcoal Black",
      "Soft White",
    ];
    const filteredColors = availableColors
      .filter((color) => allowedNames.includes(color.name))
      .sort(
        (a, b) => allowedNames.indexOf(a.name) - allowedNames.indexOf(b.name),
      );

    // Map available colors from database to display format
    const colorMap: Record<string, string> = {
      dustyRose: "/img/your-design/candle-nude.jpg",
      powderBlue: "/img/your-design/candle-blue.jpg",
      blushPink: "/img/your-design/candle-pink.jpg",
      mintGreen: "/img/your-design/candle-green.jpg",
      charcoalBlack: "/img/your-design/candle-black.jpg",
      softWhite: "/img/your-design/candle-white.jpg",
    };

    return filteredColors.map((color) => {
      const colorKey = toCamelCaseNoAccent(color.name);
      const img = colorMap[colorKey] || "/img/your-design/candle-nude.jpg";
      // Map English name to Vietnamese label
      const viLabelMap: Record<string, string> = {
        "Dusty Rose": "Nude",
        "Powder Blue": "Xanh dương",
        "Blush Pink": "Hồng",
        "Mint Green": "Xanh lục",
        "Charcoal Black": "Đen",
        "Soft White": "Trắng",
      };
      return {
        label: viLabelMap[color.name] || color.name,
        value: colorKey,
        img: img,
      };
    });
  };

  const colorOptions = getColorOptions();

  return (
    <>
      <div className="flex justify-end items-center mb-2 px-2">
        <Button
          type="text"
          icon={<ArrowRightOutlined />}
          iconPosition="end"
          onClick={onNext}
          className="text-sm font-medium text-[#212B36] hover:!text-black"
        >
          Tiếp theo
        </Button>
      </div>

      <div className="text-center">
        <Typography className="text-xl md:text-2xl text-[#212B36] font-bold mb-2">
          Thiết kế của riêng bạn
        </Typography>
        <Typography className="text-[#212B36] mb-2 text-lg">
          Chọn màu sản phẩm
        </Typography>
        <Progress
          percent={33}
          showInfo={false}
          strokeColor="#e7a87b"
          trailColor="#f5e2d8"
          size={4}
          className="mb-2"
        />
        <Typography className="text-base text-[#637381] mb-4">1/3</Typography>
      </div>

      <Radio.Group
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 mb-10"
      >
        {colorOptions.map((item) => (
          <Radio.Button
            key={item.value}
            value={item.value}
            className="p-0 border-none bg-transparent h-[154px] !text-inherit"
          >
            <div className="transition-all overflow-hidden flex flex-col items-center">
              <div className="relative w-[120px] h-[120px] flex justify-center">
                <div className="absolute top-2 left-2 z-10 w-4 h-4 border-2 border-white rounded-full bg-white flex items-center justify-center">
                  {selectedColor === item.value && (
                    <div className="w-2 h-2 rounded-full bg-black" />
                  )}
                </div>
                <Image
                  src={item.img}
                  alt={item.label}
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
              <div
                className={`text-center pt-2 text-base w-full bg-white transition-colors ${
                  selectedColor === item.value
                    ? "text-gray-800"
                    : "text-gray-500"
                }`}
              >
                {item.label}
              </div>
            </div>
          </Radio.Button>
        ))}
      </Radio.Group>

      <Button
        type="primary"
        size="large"
        className="w-full h-[48px] bg-gray-900 text-white text-base font-medium rounded-xl hover:!bg-black"
        onClick={onNext}
        disabled={!selectedColor}
      >
        Tiếp theo
      </Button>
    </>
  );
}
