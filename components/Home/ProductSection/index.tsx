import React, {useState} from "react";
import {FiArrowUpRight} from "react-icons/fi";

const tabs = [
  {id: "featured", label: "NỔI BẬT"},
  {id: "popular", label: "PHỔ BIẾN"},
  {id: "trending", label: "XU HƯỚNG"},
  {id: "newest", label: "MỚI NHẤT"},
];

const products = [
  {
    id: 1,
    category: "TRỪU TƯỢNG",
    title: "Khẽ chạm môi",
    image: "/img/products/product-1.png",
  },
  {
    id: 2,
    category: "TRỪU TƯỢNG",
    title: "Bản đồ đen trắng",
    image: "/img/products/product-2.png",
  },
  {
    id: 3,
    category: "TRỪU TƯỢNG",
    title: "Bộ tranh trừu tượng",
    image: "/img/products/product-3.png",
  },
  {
    id: 4,
    category: "NGHỆ THUẬT",
    title: "Cây trên sa mạc",
    image: "/img/products/product-4.png",
  },
  {
    id: 5,
    category: "PHONG CẢNH",
    title: "Cánh đồng vàng",
    image: "/img/products/product-5.png",
  },
  {
    id: 6,
    category: "NGHỆ THUẬT",
    title: "Hoa quả",
    image: "/img/products/product-6.png",
  },
];

export default function ProductSection() {
  const [activeTab, setActiveTab] = useState("featured");

  return (
    <section className="bg-[#161C24] py-16 md:py-20 lg:py-24 xl:py-[120px] pb-12 md:pb-16 lg:pb-[60px]">
      <div className="px-4 md:px-6 lg:px-8 xl:px-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 pb-6 md:pb-7 lg:pb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0">
            <h2 className="text-white text-3xl lg:text-4xl xl:text-[48px] font-bold text-center lg:text-left">
              NGHỆ THUẬT CỦA CHÚNG TÔI.
            </h2>

            <div className="flex items-center justify-center lg:justify-start">
              <button className="border border-white text-white bg-transparent rounded-full px-3 md:px-4 py-1 text-xs md:text-sm hover:bg-white hover:text-black transition-all">
                <span className="font-normal leading-6">XEM TẤT CẢ</span>
              </button>

              <div className="w-6 h-6 md:w-8 md:h-8 bg-[#0EC1AF] rounded-full flex items-center justify-center p-1 md:p-1.5">
                <FiArrowUpRight
                  className="text-[#161C24] w-4 h-4 md:w-5 md:h-5"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>

          {/* Tabs - Scrollable on mobile */}
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 md:px-6 lg:px-8 py-2 md:py-2.5 rounded-full border transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#FF8E1A] text-white border-[#FF8E1A]"
                    : "bg-transparent text-white border-[rgba(145,158,171,0.24)] hover:border-[rgba(145,158,171,0.4)]"
                }`}
              >
                <span className="text-sm md:text-base lg:text-lg font-semibold leading-7">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid - Responsive */}
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
          {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {/* Second row - only on desktop for 6 products total */}
          <div className="hidden lg:grid grid-cols-3 gap-4">
            {products.slice(3, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center pt-12 md:pt-16 lg:pt-20">
          <div className="flex items-center">
            <button className="border border-[rgba(145,158,171,0.32)] text-white bg-transparent rounded-full px-4 md:px-5 lg:px-6 py-2.5 md:py-3 h-10 md:h-11 lg:h-12 hover:bg-white hover:text-black transition-all">
              <span className="text-sm md:text-[15px] font-normal leading-7">
                TẤT CẢ SẢN PHẨM
              </span>
            </button>

            <div className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center  p-2 md:p-2.5 lg:p-3">
              <FiArrowUpRight
                className="text-[#212B36] w-5 h-5 md:w-6 md:h-6"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({product}: {product: (typeof products)[0]}) {
  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden mb-4 md:mb-6">
        <div className="w-full aspect-square">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 pr-4 md:pr-6">
        <p className="text-[#637381] text-sm md:text-base font-normal leading-6">
          {product.category}
        </p>
        <div className="flex items-center">
          <h3 className="text-white text-lg md:text-xl lg:text-2xl font-bold leading-9">
            {product.title}
          </h3>
          <div className="w-6 h-6 md:w-10 md:h-10 flex items-center justify-center">
            <FiArrowUpRight
              className="text-[#0EC1AF] w-3 h-3 md:w-7 md:h-7"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
