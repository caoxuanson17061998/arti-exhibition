import {Button} from "antd";
import React, {useState} from "react";
import {FiPlay} from "react-icons/fi";
import {HiArrowRight} from "react-icons/hi";
import {MdKeyboardArrowDown} from "react-icons/md";

export default function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  const scrollToNextSection = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/img/hero-video-background.png')",
          }}
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 25%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col p-4 md:p-6 lg:p-8 xl:p-10">
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Left Side - Text Content */}
          <div className="flex-1 flex flex-col justify-end gap-4 md:gap-6 lg:gap-8 lg:pr-8 xl:pr-16">
            {/* Title */}
            <div className="space-y-3 text-center lg:text-left">
              <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-[92px] font-bold leading-[1.5] text-white">
                NGHỆ THUẬT
                <br />
                THỊ GIÁC ĐA CHIỀU ĐẦY ẤN TƯỢNG
              </h1>

              {/* Subtitle */}
              <div className="px-2 lg:pl-1">
                <p className="text-base md:text-lg lg:text-xl xl:text-xl  text-white max-w-[600px] mx-auto lg:mx-0">
                  Những bức tranh này sở hữu vẻ đẹp mê hoặc như chính cái hồn mà
                  người nghệ sĩ gửi gắm, thu hút mọi ánh nhìn dù bạn đặt chúng ở
                  bất cứ đâu.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center lg:justify-start lg:pl-1">
              <Button
                size="large"
                className="bg-white text-[#212B36] border-none rounded-full h-10 md:h-11 lg:h-12 px-4 md:px-5 lg:px-6 flex items-center gap-2 md:gap-3 hover:!bg-white/90 hover:!text-[#212B36] font-bold"
              >
                <span className="text-sm md:text-base lg:text-lg xl:text-xl font-bold">
                  XEM CỬA HÀNG
                </span>
                <div className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 flex items-center justify-center">
                  <HiArrowRight className="text-[#212B36] text-lg md:text-xl" />
                </div>
              </Button>
            </div>
          </div>

          {/* Right Side - Video Card and Content */}
          <div className="w-full lg:w-[600px] flex flex-col items-center lg:items-end justify-end gap-4 md:gap-6 lg:gap-8 mt-8 lg:mt-0 lg:pl-8 xl:pl-16">
            {/* Video Card */}
            <div className="w-[234px] md:w-[250px] lg:w-[234px] bg-white rounded-2xl p-1.5 flex gap-1.5">
              {/* Video Thumbnail */}
              <div className="relative w-[148px] md:w-[155px] lg:w-[148px] h-[88px] md:h-[92px] lg:h-[88px] rounded-[11px] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center cursor-pointer"
                  style={{
                    backgroundImage: "url('/img/hero-video-thumbnail.png')",
                  }}
                  onClick={handlePlayVideo}
                />
              </div>

              {/* Video Info */}
              <div className="flex-1 flex flex-col justify-between py-2 pr-2">
                <div className="text-right">
                  <p className="text-xs text-[#212B36] ">Xem video đầy đủ</p>
                </div>

                <div className="flex justify-end">
                  <div
                    className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
                    onClick={handlePlayVideo}
                  >
                    <FiPlay className="text-[#212B36] text-lg md:text-xl ml-0.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Description Text - Hidden on mobile to match figma mobile design */}
            <div className="hidden lg:block text-right max-w-[350px]">
              <p className="text-xl  leading-[30px] text-white">
                Với kỹ thuật thị giác độc đáo được áp dụng trên bề mặt phẳng,
                mỗi tác phẩm tạo ra trải nghiệm thị giác đa chiều đầy ấn tượng.
              </p>
            </div>

            {/* Scroll Down Indicator */}
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={scrollToNextSection}
            >
              <span className="text-sm md:text-[15px] text-white leading-[26px] group-hover:underline">
                CUỘN XUỐNG ĐỂ KHÁM PHÁ
              </span>
              <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                <MdKeyboardArrowDown className="text-white text-lg md:text-xl group-hover:animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute -top-10 right-0 text-white text-2xl hover:opacity-70"
            >
              ✕
            </button>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {/* Video player would go here */}
              <div className="w-full h-full flex items-center justify-center text-white">
                <p className="text-xl">Video Player Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
