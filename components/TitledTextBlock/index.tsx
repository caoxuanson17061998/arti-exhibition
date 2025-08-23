import {Typography} from "antd";
import React from "react";

const TITLE_CLASS = "mb-2 text-[#212B36] font-bold text-2xl";
const TEXT_CLASS = "text-[#637381] text-base mb-6";

type TitledTextBlockProps = {
  title: string;
  content: React.ReactNode;
};

export function TitledTextBlock({title, content}: TitledTextBlockProps) {
  return (
    <>
      <Typography className={TITLE_CLASS}>{title}</Typography>
      <Typography className={TEXT_CLASS}>{content}</Typography>
    </>
  );
}
