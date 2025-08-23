import "./index.scss";
import {CloseOutlined, ReloadOutlined} from "@ant-design/icons";
import {
  Checkbox,
  Col,
  Drawer,
  InputNumber,
  Row,
  Slider,
  Tag,
  Typography,
} from "antd";
import axios from "axios";
import React from "react";
import {FaCheck} from "react-icons/fa";
import {useQuery} from "react-query";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  onFilterChange?: (filters: {
    colors: string[];
    size: string[];
    price: [number, number];
  }) => void;
  sizes: string[];
  setSizes: (sizes: string[]) => void;
  price: [number, number];
  setPrice: (price: [number, number]) => void;
}

export default function FilterDrawer({
  open,
  onClose,
  selectedColors,
  setSelectedColors,
  onFilterChange,
  sizes,
  setSizes,
  price,
  setPrice,
}: FilterDrawerProps) {
  // Fetch colors and sizes from API
  const {
    data: colorOptions = [],
    isLoading: isLoadingColors,
    error: colorError,
  } = useQuery(["colors"], async () => {
    const res = await axios.get("/api/colors");
    return res.data;
  });

  const {
    data: sizeOptions = [],
    isLoading: isLoadingSizes,
    error: sizeError,
  } = useQuery(["sizes"], async () => {
    const res = await axios.get("/api/sizes");
    return res.data;
  });

  const handlePriceChange = (value: number[]) => {
    setPrice(value as [number, number]);
  };

  const toggleColor = (color: string): void => {
    let newColors;
    if (selectedColors.includes(color)) {
      newColors = selectedColors.filter((c) => c !== color);
    } else {
      newColors = [...selectedColors, color];
    }
    setSelectedColors(newColors);
  };

  const handleApply = () => {
    if (onFilterChange)
      onFilterChange({
        colors: selectedColors,
        size: sizes,
        price,
      });
    onClose();
  };

  return (
    <Drawer
      title={
        <div className="flex justify-between items-center">
          <Typography className="font-semibold text-lg text-[#212B36]">
            Lọc theo
          </Typography>
          <div className="flex items-center gap-3">
            <ReloadOutlined
              className="cursor-pointer text-[#637381] text-xl m-2"
              onClick={() => {
                setSizes([]);
                setSelectedColors([]);
                setPrice([0, 1280000]);
              }}
            />
            <CloseOutlined
              className="cursor-pointer text-[#637381] text-xl m-2"
              onClick={onClose}
            />
          </div>
        </div>
      }
      closable={false}
      placement="right"
      onClose={onClose}
      open={open}
      width={320}
      footer={
        <div style={{padding: 16, textAlign: "right"}}>
          <button
            className="bg-[#212B36] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#161C24] transition"
            onClick={handleApply}
          >
            Áp dụng
          </button>
        </div>
      }
    >
      <div className="mb-6">
        <Typography className="font-semibold text-base text-[#212B36] mb-2 ml-2.5">
          Kích thước
        </Typography>
        <Checkbox.Group
          value={sizes}
          onChange={(val) => {
            setSizes(val as string[]);
          }}
        >
          <div className="flex flex-col gap-3">
            {isLoadingSizes ? (
              <span>Đang tải...</span>
            ) : sizeError ? (
              <span className="text-red-500">Lỗi tải kích thước</span>
            ) : (
              sizeOptions.map((option: any) => (
                <Checkbox
                  key={option.id}
                  value={option.id}
                  className="custom-checkbox text-sm text-[#212B36]"
                >
                  {option.name}
                </Checkbox>
              ))
            )}
          </div>
        </Checkbox.Group>
      </div>

      <div className="mb-5">
        <Typography className="font-semibold text-base text-[#212B36] mb-2 ml-2.5">
          Màu sắc
        </Typography>
        <div className="flex gap-3 flex-wrap">
          {isLoadingColors ? (
            <span>Đang tải...</span>
          ) : colorError ? (
            <span className="text-red-500">Lỗi tải màu sắc</span>
          ) : (
            colorOptions.map((color: any) => (
              <Tag
                key={color.id}
                onClick={() => toggleColor(color.id)}
                className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer flex items-center justify-center relative"
                style={{backgroundColor: color.hexCode}}
              >
                {selectedColors.includes(color.id) && (
                  <FaCheck
                    className={`pointer-events-none text-base ${
                      color.hexCode === "#fff" ? "text-black" : "text-white"
                    }`}
                  />
                )}
              </Tag>
            ))
          )}
        </div>
      </div>
      {/* Giá */}
      <div className="mb-5">
        <Typography className="font-semibold text-base text-[#212B36] mb-2 ml-2.5">
          Giá
        </Typography>
        <Row gutter={12}>
          <Col span={12}>
            <InputNumber
              min={0}
              max={1280000}
              value={price[0]}
              onChange={(val) => handlePriceChange([val || 0, price[1]])}
              style={{width: "100%"}}
            />
          </Col>
          <Col span={12}>
            <InputNumber
              min={0}
              max={1280000}
              value={price[1]}
              onChange={(val) => handlePriceChange([price[0], val || 1280000])}
              style={{width: "100%"}}
            />
          </Col>
        </Row>
        <Slider
          range
          min={0}
          max={1280000}
          step={10000}
          value={price}
          onChange={handlePriceChange}
        />
      </div>
    </Drawer>
  );
}
