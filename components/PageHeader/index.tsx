import {Typography} from "antd";
import React from "react";

type PageHeaderProps = {
  title: string;
  subtitle: string;
  backgroundImage: string;
};

const headerBackground = `
    linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    linear-gradient(92.2deg, rgba(225, 189, 169, 0.32) 0%, rgba(14, 193, 175, 0.32) 100.43%)
  `;

export function PageHeader({
  title,
  subtitle,
  backgroundImage,
}: PageHeaderProps) {
  return (
    <div
      className="relative bg-cover bg-center h-[300px] flex items-center justify-center"
      style={{backgroundImage: `url(${backgroundImage})`}}
    >
      <div
        className="absolute inset-0"
        style={{background: headerBackground}}
      />
      <div className="relative z-10 text-center">
        <Typography className="text-white text-[32px] md:text-5xl font-extrabold mb-1">
          {title}
        </Typography>
        <Typography className="text-white text-base">{subtitle}</Typography>
      </div>
    </div>
  );
}
