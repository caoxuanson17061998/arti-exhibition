import {ArrowRightOutlined} from "@ant-design/icons";
import {Button, Col, Image, Row, Space, Typography} from "antd";
import {useRouter} from "next/router";
import React from "react";
import {MdOutlineArrowOutward} from "react-icons/md";

export default function IntroduceComponent() {
  const router = useRouter();
  return (
    <div
      className="relative w-full bg-cover bg-center"
      style={{backgroundImage: "url('/img/home/banner.svg')"}}
    >
      <div className="h-[400px] flex flex-col justify-center text-center">
        <div className="flex justify-center">
          <Typography className="text-5xl md:text-9xl mb-2 font-light">
            ART EXHIBITION
            <sup className="text-xl md:text-5xl align-top left-1 top-0.5 md:left-2 md:top-2">
              ®
            </sup>
          </Typography>
        </div>
        <Typography className="text-[14px]  md:text-2xl text-[#212B36] mb-4 lg:mb-0">
          Tự tay tạo nên hương thơm của riêng bạn
        </Typography>
        <Button className="bg-[#212B36] text-white rounded-[10px] px-4 py-1.5 h-9 items-center gap-2  hover:!bg-[#1A1F2C] hover:!text-white hover:!opacity-100 transition-all duration-200 hover:!none flex lg:hidden mx-auto">
          Khám phá ngay
          <MdOutlineArrowOutward />
        </Button>
      </div>

      <div className="h-[380px] md:h-[594px] flex items-end px-4 md:px-16 lg:px-24 pb-10">
        <Row align="bottom" justify="space-between" className="w-full">
          <Col xs={0} md={12} lg={14}>
            <Space direction="vertical" size="middle" className="text-left">
              <Typography className="text-white font-bold text-2xl">
                Khơi dậy cảm xúc riêng biệt.
                <br />
                Thắp sáng không gian theo cách của bạn.
              </Typography>

              <Typography className="text-base text-white max-w-xl">
                Khám phá sức mạnh của hương thơm tự nhiên với bộ sản phẩm được
                tạo nên từ các nguyên liệu thiên nhiên – dành cho những ai mong
                muốn tự tay làm nên những cây nến mang đậm dấu ấn cá nhân.
              </Typography>

              <Button
                onClick={() => router.push("/your-design")}
                type="primary"
                size="large"
                className="bg-[#212B36] text-white hover:!bg-gray-800 w-fit flex items-center gap-2"
              >
                Tự thiết kế nến
                <ArrowRightOutlined />
              </Button>
            </Space>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <div className="flex items-center justify-end gap-4">
              <Image
                alt="Candle product"
                src="/img/home/candles/candle-banner.svg"
                preview={false}
                className="!w-[164px] !h-[164px] object-cover md:!h-full max-w-none rounded-[32px]"
              />

              <div className="w-[164px] h-[164px] md:h-[220px] flex flex-col justify-center relative backdrop-blur-md rounded-[32px] bg-white/30 border border-[#FFFFFF3D] px-4 pt-5 pb-8">
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full  border border-[#FFFFFF52]" />
                <Image
                  src="/img/home/icon-leaf.svg"
                  alt="leaf icon"
                  className="!w-8 !h-8 mb-3"
                  preview={false}
                />
                <Typography className="text-lg text-white font-semibold mb-1">
                  Sản phẩm từ thiên nhiên
                </Typography>
                <Typography className="text-sm text-white hidden md:block">
                  Nhẹ nhàng sưởi ấm không gian sống
                </Typography>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
