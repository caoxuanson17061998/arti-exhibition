import React from "react";
import {FiArrowUpRight} from "react-icons/fi";

export default function CTASection() {
  return (
    <section className="relative bg-[#FFFCFA] py-16   pb-8 md:pb-10 flex flex-col items-center gap-12 md:gap-16 lg:gap-20 xl:gap-[83px]">
      {/* Decorative Elements */}
      <div
        className="absolute -left-[100px] top-[147px] w-[534px] h-[534px] rounded-full"
        style={{
          background: "rgba(255, 142, 26, 0.2)",
          filter: "blur(350px)",
        }}
      />
      <div
        className="absolute right-[1173px] bottom-[561px] w-[534px] h-[534px] rounded-full"
        style={{
          background: "rgba(255, 142, 26, 0.2)",
          filter: "blur(350px)",
        }}
      />

      <div className="px-4 md:px-6 lg:px-8 xl:px-10 flex flex-col items-center gap-8 md:gap-12 lg:gap-16">
        {/* Content Card */}
        <div className="bg-[rgba(255,255,255,0.32)] backdrop-blur-sm rounded-[40px] p-8 md:p-12 lg:p-16 xl:p-[120px] px-6 md:px-8 lg:px-10 flex flex-col items-center gap-8 md:gap-12 lg:gap-16 max-w-6xl">
          {/* Text Content */}
          <div className="flex flex-col items-center gap-6 md:gap-8 lg:gap-12 xl:gap-16">
            <h2 className="text-[#212B36] text-2xl md:text-3xl lg:text-4xl xl:text-[48px] font-semibold leading-[1.5] text-center max-w-[700px]">
              Sẵn Sàng Biến Không Gian Của Bạn Thành Một Tác Phẩm Nghệ Thuật?
            </h2>

            <p className="text-[#637381] text-base md:text-lg lg:text-xl  text-center max-w-2xl">
              Khám phá bộ sưu tập của chúng tôi ngay hôm nay và tìm thấy bức
              tranh định nghĩa phong cách của bạn.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 lg:gap-10">
            {/* Explore Button */}
            <div className="flex items-center">
              <button className="border border-[#212B36] text-[#212B36] bg-transparent rounded-full px-4 md:px-5 lg:px-6 py-2.5 md:py-3 hover:bg-[#212B36] hover:text-white transition-all">
                <span className="text-sm md:text-[15px] font-normal leading-7">
                  KHÁM PHÁ NGAY!
                </span>
              </button>

              <div className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-[#212B36] rounded-full flex items-center justify-center  p-2 md:p-2.5 lg:p-3">
                <FiArrowUpRight
                  className="text-white w-5 h-5 md:w-6 md:h-6"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Contact Button */}
            <button className="border border-[#212B36] text-[#212B36] bg-transparent rounded-full px-4 md:px-5 lg:px-6 py-2.5 md:py-3 hover:bg-[#212B36] hover:text-white transition-all w-full sm:w-[139px]">
              <span className="text-sm md:text-[15px] font-normal leading-7">
                LIÊN HỆ
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
