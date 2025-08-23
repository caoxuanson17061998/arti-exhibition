import {Avatar, Button, Col, Image, Row, Space, Typography} from "antd";
import {useRouter} from "next/router";
import React from "react";

const candleData = [
  {img: "/img/home/candles/candle-pink.svg"},
  {img: "/img/home/candles/candle-blue.svg"},
  {img: "/img/home/candles/candle-green.svg"},
  {img: "/img/home/candles/candle-rose.svg"},
];

export default function CandleSection() {
  const router = useRouter();
  return (
    <div className="bg-[#1A202C] py-10 md:py-[120px] rounded-t-[80px]">
      <div className="container mx-auto px-5">
        <Row align="top">
          <Col xs={24} md={12} lg={16} className="mb-10 md:mb-0">
            <Typography className="mb-4 text-white font-extrabold text-[32px] lg:max-w-[570px]">
              Khám phá và Tự Tay tạo nên những Cây Nến của Riêng Bạn
            </Typography>
            <Typography className="text-white text-lg font-normal lg:pl-20 lg:max-w-[730px]">
              Tùy chỉnh nhãn, pha trộn hương thơm theo phong cách riêng, và tạo
              nên cây nến mang đậm dấu ấn cá nhân.
            </Typography>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Space
              direction="horizontal"
              size="large"
              className="w-full flex justify-between items-center rounded-xl"
            >
              <div className="flex flex-col gap-1">
                <div className="flex -space-x-3">
                  <Avatar
                    src="/img/avatar/avatar-1.svg"
                    size={60}
                    className="z-30"
                  />
                  <Avatar
                    src="/img/avatar/avatar-2.svg"
                    size={60}
                    className="z-20"
                  />
                  <Avatar
                    src="/img/avatar/avatar-3.svg"
                    size={60}
                    className="z-10"
                  />
                </div>
                <div>
                  <Typography className="text-white text-[40px] font-normal">
                    5.2K
                  </Typography>
                  <Typography className="text-white text-base font-normal">
                    Đánh giá 5 sao từ khách hàng
                  </Typography>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <Typography className="text-white text-xl">
                    thuần khiết
                  </Typography>
                  <Typography className="text-white text-xl">
                    trong từng
                  </Typography>
                  <Typography className="text-white text-xl">
                    hương thơm
                  </Typography>
                </div>
                <Image
                  src="/img/home/union.svg"
                  height={60}
                  width={147.8}
                  preview={false}
                />
              </div>
            </Space>
          </Col>
        </Row>

        <Row gutter={[32, 32]} className="mt-20">
          {candleData.map((candle, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <div className="w-full h-full flex items-center justify-center">
                <Image
                  src={candle.img}
                  alt={`Candle ${idx + 1}`}
                  preview={false}
                  className="w-full h-full object-contain rounded-3xl"
                />
              </div>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-16">
          <Typography className="text-white text-[32px] font-extrabold">
            Khám Phá Không Gian Sáng Tạo Của
          </Typography>
          <Typography className="text-white text-[32px] font-extrabold mb-4">
            Chúng Tôi
          </Typography>
          <Typography className="text-white mb-12 text-lg">
            Nơi ý tưởng trở thành những cây nến thơm đầy cảm hứng
          </Typography>
          <Space size="small">
            <Button
              onClick={() => router.push("/your-design")}
              type="default"
              className="bg-white text-[#212B36] h-[70px] text-xl px-10 py-5 rounded-full capitalize"
            >
              Xem Ngay
            </Button>
            <Button
              onClick={() => router.push("/your-design")}
              type="default"
              className="bg-[#0EC1AF] border-none h-[70px] text-[#161C24] px-[30px] py-[13px] rounded-full text-center flex flex-col gap-0"
            >
              <span className="text-sm">Chỉ từ</span>
              <span className="text-xl ">99K</span>
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
}
