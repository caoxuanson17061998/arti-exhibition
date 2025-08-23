import React, {useState} from "react";

const categories = [
  {
    id: 1,
    title: "Phong cảnh",
    subtitle: "Bình yên và hùng vĩ",
    image: "/img/categories/category-phong-canh.png",
  },
  {
    id: 2,
    title: "Trừu Tượng",
    subtitle: "Sức mạnh trí tưởng tượng",
    image: "/img/categories/category-truu-tuong.png",
  },
  {
    id: 3,
    title: "Nghệ Thuật",
    subtitle: "Chiều sâu của tâm hồn",
    image: "/img/categories/category-nghe-thuat.png",
  },
  {
    id: 4,
    title: "Hiện Đại",
    subtitle: "Nét đẹp đương đại",
    image: "/img/categories/category-hien-dai.png",
  },
];

export default function FeaturedCategoriesSection() {
  const [, setHoveredCategory] = useState<number | null>(null);

  return (
    <section className="relative bg-white min-h-[600px] lg:min-h-[800px] xl:min-h-[1024px] flex items-center">
      {/* Decorative Blur Elements */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "rgba(255, 142, 26, 0.32)",
          filter: "blur(350px)",
          left: "-100px",
          top: "153px",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "rgba(255, 142, 26, 0.32)",
          filter: "blur(350px)",
          right: "-200px",
          top: "312px",
        }}
      />

      {/* Container */}
      <div className="relative z-10 w-full px-4 md:px-6 lg:px-8 xl:px-10 py-16 md:py-20 lg:py-24 xl:py-[120px]">
        <div className="flex flex-col items-center gap-4 md:gap-5 lg:gap-6">
          {/* Section Title */}
          <h2 className="text-[#212B36] text-xl md:text-2xl lg:text-[32px] font-bold leading-[1.5] text-center">
            KHÁM PHÁ THEO CHỦ ĐỀ
          </h2>

          {/* Categories Grid - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-7xl">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative group cursor-pointer rounded-[40px] overflow-hidden h-[200px] md:h-[250px] lg:h-[350px] xl:h-[504px] flex flex-col justify-center items-center p-4 md:p-6"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${category.image}')`,
                  }}
                />

                {/* Backdrop Overlay */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    background: "rgba(22, 28, 36, 0.48)",
                  }}
                />

                {/* Content */}
                <div className="relative z-10 text-center">
                  <h3 className="text-white text-lg md:text-xl lg:text-2xl font-bold leading-[1.5] mb-1 transition-transform duration-300 group-hover:scale-105">
                    {category.title}
                  </h3>
                  <p className="text-white text-sm md:text-base font-normal leading-[1.5] transition-transform duration-300 group-hover:scale-105">
                    {category.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Content */}
          <div className="text-center max-w-4xl mt-4 md:mt-5 lg:mt-6 px-4 text-[#212B36] ">
            <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-[48px] font-bold leading-[1.33] mb-3">
              DANH MỤC TRANH NỔI BẬT
            </h3>
            <p className="md:text-lg lg:text-xl xl:text-2xl text-[#637381]">
              Khám phá thế giới nghệ thuật qua các bộ sưu tập được phân loại tỉ
              mỉ. Dù bạn tìm kiếm tranh phong cảnh, trừu tượng, hay chân dung,
              chúng tôi đều có tác phẩm phù hợp cho không gian sống của bạn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
