import {ArrowLeftOutlined, ArrowRightOutlined} from "@ant-design/icons";
import {SCENT_OPTIONS} from "@app/constants";
import {Button, Progress, Tag, Typography} from "antd";
import clsx from "clsx";
import React from "react";

interface Scent {
  id: string;
  name: string;
}

interface Step2ScentSelectorProps {
  selectedScents: string[];
  toggleScent: (scent: string) => void;
  onNext: () => void;
  onBack: () => void;
  availableScents: Scent[];
}

export function Step2ScentSelectorComponent({
  selectedScents,
  toggleScent,
  onNext,
  onBack,
  availableScents,
}: Step2ScentSelectorProps) {
  // Use database scents if available, otherwise fallback to constants
  const getScentOptions = () => {
    if (availableScents.length === 0) {
      return SCENT_OPTIONS.map((option) => ({
        label: option.label,
        value: option.value,
      }));
    }

    return availableScents.map((scent) => ({
      label: scent.name,
      value: scent.id,
    }));
  };

  const scentOptions = getScentOptions();

  const mappedScentOptions = scentOptions.map((option) => {
    const selected = selectedScents.includes(option.label);
    const disabled = !selected && selectedScents.length >= 3;
    return {...option, selected, disabled};
  });

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
          disabled={selectedScents.length === 0}
          className={clsx(
            "text-sm font-medium",
            selectedScents.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:!text-black",
          )}
        >
          Tiếp theo
        </Button>
      </div>

      <div className="text-center">
        <Typography className="text-xl md:text-2xl text-[#212B36] font-bold mb-2">
          Thiết kế của riêng bạn
        </Typography>
        <Typography className="text-[#212B36] mb-2 text-lg">
          Chọn mùi hương
        </Typography>
        <Progress
          percent={66}
          showInfo={false}
          strokeColor="#e7a87b"
          trailColor="#f5e2d8"
          size={4}
          className="mb-2"
        />
        <Typography className="text-base text-[#637381] mb-4">2/3</Typography>
      </div>

      <Typography className="text-[#637381] text-sm text-center mb-4">
        Chọn tối đa 3 mùi hương
      </Typography>
      <div className="flex flex-wrap gap-2 justify-center">
        {mappedScentOptions.map((option) => (
          <Tag
            key={option.value}
            bordered={false}
            onClick={() => !option.disabled && toggleScent(option.label)}
            className={clsx(
              "rounded-[6px] px-3 py-1 text-sm font-medium transition-all cursor-pointer",
              {
                "bg-[#E1BDA929] text-[#D38B65]": option.selected,
                "bg-[#919EAB29] text-[#637381]":
                  !option.selected && !option.disabled,
                "bg-[#F4ECE6] text-[#B9A89F] opacity-50 cursor-not-allowed":
                  option.disabled,
              },
            )}
          >
            {option.label}
          </Tag>
        ))}
      </div>

      <Button
        type="primary"
        size="large"
        className={clsx(
          "mt-8 w-full h-[48px] text-base font-medium rounded-xl",
          {
            "bg-gray-900 text-white hover:!bg-black": selectedScents.length > 0,
            "bg-gray-300 text-white cursor-not-allowed":
              selectedScents.length === 0,
          },
        )}
        onClick={onNext}
        disabled={selectedScents.length === 0}
      >
        Tiếp theo
      </Button>
    </>
  );
}
