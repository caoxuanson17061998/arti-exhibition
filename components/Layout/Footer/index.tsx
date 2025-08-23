import "./index.scss";
import {Button, Input, Layout, Typography} from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {FaFacebookF, FaInstagram, FaTiktok} from "react-icons/fa";
import {FiArrowRight, FiArrowUp} from "react-icons/fi";
import {SiThreads} from "react-icons/si";

const {Footer} = Layout;

export default function FooterComponent() {
  return (
    <Footer className="bg-[#161C24] text-white pt-16 md:pt-24 lg:pt-[120px] pb-8 md:pb-10">
      <div
        className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-10"
        style={{maxWidth: "1200px"}}
      >
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:gap-8 mb-8 md:mb-10">
          <Typography className="text-white text-2xl md:text-3xl lg:text-4xl xl:text-[48px] font-bold leading-[1.4] md:leading-[1.35] lg:leading-[1] max-w-none lg:max-w-[680px]">
            Đăng ký để nhận thông tin cập nhật và ưu đãi.
          </Typography>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 lg:gap-8">
            <Input
              className="md:w-[440px] w-full text-[#919EAB] rounded-2xl placeholder:text-red-300 hover:bg-transparent border-[#919EAB] focus:border-[#0EC1AF] focus:ring-0"
              placeholder="Nhập địa chỉ email"
              suffix={
                <Button
                  type="text"
                  icon={
                    <FiArrowRight className="text-lg md:text-xl hover:text-[#919EAB]" />
                  }
                  className="border-none bg-transparent flex justify-center items-center hover:bg-transparent text-[#919EAB] hover:text-[#919EAB]"
                  size="large"
                />
              }
              style={{
                borderRadius: 16,
                backgroundColor: "transparent",
                borderColor: "#919EAB",
                fontSize: window.innerWidth >= 768 ? 20 : 16,
                height: window.innerWidth >= 768 ? 56 : 48,
                padding: "0 14px",
              }}
            />

            <div className="flex flex-wrap gap-4 md:gap-6 lg:gap-8 w-full lg:w-auto justify-center lg:justify-start">
              <Link
                href="/about-us"
                className="text-white hover:text-gray-300 text-base md:text-lg "
              >
                Giới thiệu
              </Link>
              <Link
                href="/contact"
                className="text-white hover:text-gray-300 text-base md:text-lg "
              >
                Liên hệ
              </Link>
              <Link
                href="/blog"
                className="text-white hover:text-gray-300 text-base md:text-lg "
              >
                Blog
              </Link>
              <Link
                href="/return-policy"
                className="text-white hover:text-gray-300 text-base md:text-lg "
              >
                Đổi trả
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-[rgba(145,158,171,0.24)] my-8 md:my-10" />

        {/* Logo Section */}
        <div className="flex justify-center mb-8 md:mb-10">
          <Image
            src="/img/logo-footer.svg"
            alt="Art Exhibition Logo"
            width={200}
            height={60}
            className="w-full"
          />
        </div>

        {/* End Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-0">
          {/* Left side - Copyright and links */}
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 lg:gap-8 order-2 lg:order-1">
            <Link
              href="/privacy-policy"
              className="text-[#637381] hover:text-white text-sm md:text-base"
            >
              Chính sách bảo mật
            </Link>
            <Link
              href="/term-of-service"
              className="text-[#637381] hover:text-white text-sm md:text-base"
            >
              Điều khoản & Điều kiện
            </Link>
            <Typography className="text-[#637381] text-sm md:text-base">
              ©2025 Art Exhibition.
            </Typography>
          </div>

          {/* Right side - Social icons and scroll to top */}
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 order-1 lg:order-2">
            <div className="flex items-center gap-4 md:gap-6">
              <FaFacebookF className="text-[#637381] hover:text-white text-lg md:text-xl cursor-pointer transition-colors" />
              <FaInstagram className="text-[#637381] hover:text-white text-lg md:text-xl cursor-pointer transition-colors" />
              <SiThreads className="text-[#637381] hover:text-white text-lg md:text-xl cursor-pointer transition-colors" />
              <FaTiktok className="text-[#637381] hover:text-white text-lg md:text-xl cursor-pointer transition-colors" />
            </div>

            <Button
              type="text"
              className="text-white hover:text-gray-300 text-xs md:text-sm flex items-center gap-2 h-8 md:h-9 px-0"
              onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
              icon={<FiArrowUp className="text-base md:text-lg" />}
            >
              ĐẦU TRANG
            </Button>
          </div>
        </div>
      </div>
    </Footer>
  );
}
