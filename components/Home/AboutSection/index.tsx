import {Button} from "antd";
import React from "react";
import {HiArrowRight} from "react-icons/hi";

export default function AboutSection() {
  return (
    <section className="relative bg-white pt-16 md:pt-20">
      {/* Container */}
      <div className="relative bg-white rounded-t-[40px] px-4 md:px-6 lg:px-8 xl:px-10 py-8 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10 items-stretch max-w-7xl mx-auto">
          {/* Image */}
          <div className="w-full lg:flex-1">
            <div
              className="w-full h-80 md:h-80 lg:h-80 bg-cover bg-center rounded-[40px] lg:min-h-[600px]"
              style={{
                backgroundImage: "url('/img/about-section-image.png')",
              }}
            />
          </div>

          {/* Content */}
          <div className="w-full lg:flex-1 flex flex-col gap-4 md:gap-5 lg:gap-6 lg:pr-8 justify-center">
            <div className="flex flex-col gap-3 text-center lg:text-left">
              <div className="text-[#212B36] text-2xl md:text-3xl lg:text-4xl xl:text-[64px] font-bold leading-[1.4] md:leading-[1.35] lg:leading-[1]">
                NƠI NGHỆ THUẬT CHẠM SÂU ĐẾN TÂM HỒN
              </div>

              <p className="text-[#212B36] text-lg md:text-xl lg:text-2xl font-bold leading-[1.5]">
                Tại Art Exhibition, chúng tôi tin rằng nghệ thuật có sức mạnh
                kết nối và truyền cảm hứng.
              </p>

              <div className="lg:h-[90px]">
                <p className="text-[#637381] text-base md:text-lg lg:text-xl">
                  Mỗi bức tranh tại đây không chỉ là một tác phẩm trang trí mà
                  còn là một cánh cửa mở ra thế giới quan của người nghệ sĩ,
                  phản ánh những câu chuyện, cảm xúc và vẻ đẹp cuộc sống
                </p>
              </div>
            </div>

            <div className="flex justify-center lg:justify-start">
              <Button
                size="large"
                className="bg-[#212B36] text-white border-none rounded-full h-10 md:h-11 lg:h-12 px-4 md:px-5 lg:px-[22px] py-2 md:py-2.5 lg:py-[11px] flex items-center gap-2 hover:!bg-[#212B36]/90 hover:!text-white"
              >
                <span className="text-sm md:text-[15px] font-normal leading-[1.73]">
                  XEM THÊM
                </span>
                <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                  <HiArrowRight className="text-white text-base md:text-lg" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
