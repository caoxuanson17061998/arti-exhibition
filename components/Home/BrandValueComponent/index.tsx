import {Button, Col, Image, Row, Space, Typography} from "antd";
import {useRouter} from "next/router";
import React from "react";

export default function BrandValueComponent() {
  const router = useRouter();
  return (
    <div className="container mx-auto py-10 md:py-[120px] px-5">
      <Row align="top" className="mb-6 md:mb-20">
        <Col xs={24} md={8} lg={4} className="mb-3 md:mb-0">
          <Typography>
            <Typography className="text-base text-[#212B36] uppercase">
              Tận Hưởng từng <br /> Khoảnh Khắc
            </Typography>
          </Typography>
        </Col>

        <Col xs={24} md={8} className="mb-3 md:mb-0">
          <Typography className="text-[#212B36] text-[24px] md:text-[32px] font-bold ml-8 md:ml-0">
            Cảm nhận sự khác biệt: Ôm trọn cảm xúc trong từng ngọn lửa
          </Typography>
        </Col>

        <Col xs={24} md={8} lg={10} className="pl-0 lg:pl-[168px]">
          <Typography className="text-base text-[#212B36]">
            Đắm chìm trong không gian thư giãn, nơi mỗi giọt hương mang theo cảm
            xúc riêng biệt. Trải nghiệm sự an yên thuần khiết với nến thơm thủ
            công - thiết kế dành riêng cho bạn.
          </Typography>
        </Col>
      </Row>

      <Row className="flex justify-center mb-6 md:mb-0">
        <Button
          onClick={() => router.push("/products")}
          type="primary"
          className="bg-[#212B36] rounded-2xl px-[22px] py-[11px] text-white text-base"
        >
          Mua Ngay
        </Button>
      </Row>

      {/* Card Section */}
      <Row gutter={24} align="bottom">
        <Col xs={24} md={8} className="mb-6 md:mb-0 flex justify-center">
          <div className="relative rounded-[48px] overflow-hidden !w-[335px] md:!w-full !h-[229px] md:!h-full">
            <Image
              src="/img/home/candles/candle-nature.jpg"
              alt="100% Thiên nhiên"
              preview={false}
              className="rounded-[48px] object-cover w-full h-full"
            />
            <Space
              direction="vertical"
              className="absolute bottom-10 left-10 text-left"
            >
              <Typography className="text-white text-[32px] md:text-5xl font-extrabold">
                100%
              </Typography>
              <Typography className="text-white text-2xl md:text-[32px] font-bold">
                Thiên nhiên
              </Typography>
            </Space>
          </div>
        </Col>

        <Col xs={24} md={8} className="mb-6 md:mb-0 flex justify-center">
          <div className="relative rounded-[48px] overflow-hidden !w-[335px] md:!w-full !h-[229px] md:!h-full">
            <Image
              src="/img/home/candles/candle-custom.jpg"
              alt="Cá nhân hóa"
              preview={false}
              className="rounded-[48px] object-cover w-full h-full"
            />
            <Space direction="vertical" className="absolute top-10 left-10">
              <Typography className="text-white text-[32px] md:text-5xl font-extrabold">
                Cá <br /> nhân <br /> hóa
              </Typography>
            </Space>
          </div>
        </Col>

        <Col xs={24} md={8} className="flex justify-center">
          <div className="relative rounded-[48px] overflow-hidden !w-[335px] md:!w-full !h-[229px] md:!h-full">
            <Image
              src="/img/home/candles/candle-social-meaning.jpg"
              alt="Ý nghĩa xã hội"
              preview={false}
              className="rounded-[48px] object-cover w-full h-full"
            />
            <Space direction="vertical" className="absolute top-10 left-10">
              <Typography className="text-white text-[32px] md:text-5xl font-extrabold">
                Ý nghĩa <br /> xã hội
              </Typography>
            </Space>
          </div>
        </Col>
      </Row>
    </div>
  );
}
