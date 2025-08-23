import React from "react";

const features = [
  {
    id: 1,
    icon: "/img/icons/bucket-square.svg",
    title: "Tuyển Chọn\nTinh Hoa",
    description:
      "Mỗi tác phẩm đều được lựa chọn tỉ mỉ, đảm bảo chất lượng và sự độc đáo.",
  },
  {
    id: 2,
    icon: "/img/icons/frame.svg",
    title: "Hợp Tác\nNghệ Sĩ",
    description:
      "Kết nối bạn với các nghệ sĩ tài năng, khám phá đa dạng phong cách.",
  },
  {
    id: 3,
    icon: "/img/icons/tick-circle.svg",
    title: "Trải Nghiệm\nDễ Dàng",
    description:
      "Quy trình lựa chọn và sở hữu tác phẩm luôn được tối ưu, đơn giản và thú vị.",
  },
  {
    id: 4,
    icon: "/img/icons/like-shapes.svg",
    title: "Cam Kết\nChất Lượng",
    description:
      "Đảm bảo nguồn gốc, chất lượng tranh cùng dịch vụ hỗ trợ tận tâm.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="relative bg-[#FFFCFA] pt-16 ">
      {/* Decorative Element */}

      <div className="px-4 md:px-6 lg:px-8 xl:px-10 flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-20">
        {/* Left Column - Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center gap-3 md:gap-4 text-center lg:text-left">
          <h2 className="text-[#212B36] text-2xl md:text-3xl lg:text-4xl xl:text-[48px] font-bold leading-[1.2]">
            VÌ SAO NÊN CHỌN ART EXHIBITION?
          </h2>
          <p className="text-[#637381] text-lg md:text-xl lg:text-2xl  max-w-lg mx-auto lg:mx-0">
            Chúng tôi cam kết mang đến những tác phẩm nghệ thuật độc đáo và
            những trải nghiệm mua sắm tuyệt vời.
          </p>
        </div>

        {/* Right Column - Features Grid */}
        <div className="w-full lg:w-[593.6px] flex flex-col gap-4 md:gap-5 lg:gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
            <FeatureCard feature={features[0]} />
            <FeatureCard feature={features[1]} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
            <FeatureCard feature={features[2]} />
            <FeatureCard feature={features[3]} />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({feature}: {feature: (typeof features)[0]}) {
  return (
    <div className="bg-[rgba(255,255,255,0.56)] rounded-[40px] p-6 md:p-7 lg:p-8 flex flex-col gap-4 md:gap-5 backdrop-blur-sm hover:bg-[rgba(255,255,255,0.7)] transition-all duration-300">
      {/* Icon */}
      <div className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center">
        <img
          src={feature.icon}
          alt={feature.title}
          className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 md:gap-3">
        <h3 className="text-[#212B36] text-xl md:text-2xl lg:text-[32px] font-bold leading-[1.5] whitespace-pre-line">
          {feature.title}
        </h3>
        <p className="text-[#212B36] text-base md:text-lg lg:text-2xl ">
          {feature.description}
        </p>
      </div>
    </div>
  );
}
