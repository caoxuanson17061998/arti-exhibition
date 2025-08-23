import {addToCart, setCartOpen} from "../../../redux/slices/CartSlice";
import {IRootState} from "../../../redux/store";
import {ShoppingCartOutlined} from "@ant-design/icons";
import {Product, ProductCategory} from "@app/types";
import ShoppingCartDrawer from "@components/ShoppingCartDrawer";
import {
  useCategoriesQuery,
  useProductsQuery,
} from "@module/home/useDashboardQueries";
import {Button, Card, Col, Row, Spin, Tag, Typography} from "antd";
import {useRouter} from "next/router";
import React, {useMemo, useState} from "react";
import {MdOutlineArrowOutward} from "react-icons/md";
import {useDispatch, useSelector} from "react-redux";

interface ProductListComponentProps {
  onProductClick?: (id: string) => void;
}

export default function ProductListComponent({
  onProductClick,
}: ProductListComponentProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isCartOpen = useSelector((state: IRootState) => state.cart.isCartOpen);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch products and categories from API
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProductsQuery();
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategoriesQuery();

  // Create dynamic tab options from categories
  const tabOptions = useMemo(() => {
    const allTab = {key: "all", label: "Tất cả"};
    const categoryTabs = categories.map((category) => ({
      key: category.id,
      label: category.name,
    }));
    return [allTab, ...categoryTabs];
  }, [categories]);

  // Filter products based on active tab
  const filteredProducts = useMemo(() => {
    if (activeTab === "all") return products;

    return products.filter((product: Product) =>
      product.categories.some(
        (cat: ProductCategory) => cat.category.id === activeTab,
      ),
    );
  }, [products, activeTab]);

  // Helper function to determine tag based on product properties
  const getProductTag = (product: Product) => {
    if (product.isOnSale) return "SALE";

    // Check if product is new (created within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const productDate = new Date(product.createdAt);

    if (productDate > thirtyDaysAgo) return "NEW";

    // Check if product is popular (high rating or review count)
    if (product.rating >= 4.5 || product.reviewCount >= 50) return "HOT";

    return null;
  };

  // Helper function to get tag color
  const getTagColor = (tag: string) => {
    switch (tag) {
      case "SALE":
        return "#F44336";
      case "NEW":
        return "#03A9F4";
      case "HOT":
        return "#FF9800";
      default:
        return "#919EAB";
    }
  };

  // Handle add to cart when clicking on product
  const handleAddToCart = (product: Product) => {
    const cartItem = {
      ...product,
      selectedColors:
        product.colors && product.colors.length > 0
          ? [product.colors[0].color.hexCode]
          : [],
      selectedSize:
        product.sizes && product.sizes.length > 0
          ? product.sizes[0].size.name
          : undefined,
    };
    dispatch(addToCart(cartItem));
    dispatch(setCartOpen(true));
  };

  // Combined loading and error states
  const isLoading = isLoadingProducts || isLoadingCategories;
  const hasError = productsError || categoriesError;

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-5 py-10 md:py-[120px] flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="max-w-[1200px] mx-auto px-5 py-10 md:py-[120px] text-center">
        <Typography className="text-red-500">
          Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
        </Typography>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10 md:py-[120px]">
      <div className="text-center mb-6 md:mb-12">
        <Typography className="text-[#212B36] text-[32px] md:text-5xl font-extrabold mb-2">
          Hãy nhìn vào sản phẩm <br className="hidden md:block" /> của chúng tôi
        </Typography>
        <Typography className="text-[#212B36] text-lg md:text-xl">
          Thuần khiết trong từng hương thơm
        </Typography>
      </div>

      <div className="flex justify-center mb-6 md:mb-12">
        <div className="w-full max-w-4xl overflow-x-auto">
          <div className="flex gap-3 pb-2 md:pb-0 min-w-max md:min-w-0 md:flex-wrap justify-center">
            {/* eslint-disable-next-line react/no-unused-prop-types */}
            {tabOptions.map(({key, label}: {key: string; label: string}) => (
              <Button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 md:px-9 py-2 md:py-3 rounded-2xl h-10 md:h-12 text-sm md:text-base text-center transition font-semibold hover:!border-none whitespace-nowrap flex-shrink-0
                ${
                  activeTab === key
                    ? "bg-[#EBC8B5] text-[#161C24] hover:!bg-[#E1BFAE] hover:!text-white"
                    : "bg-[#919EAB14] text-[#637381] hover:!bg-[#D0D7DE] hover:!text-[#212B36]"
                }`}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Row gutter={[16, 24]} className="mb-6 md:mb-12">
        {filteredProducts.map((product: Product) => {
          const tag = getProductTag(product);

          return (
            <Col key={product.id} xs={24} sm={12} lg={6}>
              <Card
                hoverable
                cover={
                  <div className="relative">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="relative h-64 w-full bg-white bg-center bg-cover rounded-xl overflow-hidden group p-0 border-none shadow-none"
                      style={{
                        backgroundImage: `url(${
                          product.thumbnailUrl ||
                          "/img/home/candles/candle-1.svg"
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {tag && (
                        <Tag
                          color={getTagColor(tag)}
                          className="absolute top-2 right-2 z-10"
                        >
                          {tag}
                        </Tag>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
                        <ShoppingCartOutlined className="text-white text-3xl" />
                      </div>
                    </Button>
                  </div>
                }
              >
                <div
                  role="presentation"
                  onClick={() =>
                    typeof onProductClick === "function"
                      ? onProductClick(product.id)
                      : undefined
                  }
                  className="cursor-pointer"
                >
                  <Typography className="text-[#212B36] text-lg font-semibold mb-3">
                    {product.name}
                  </Typography>
                  <div className="flex gap-1 justify-end items-center">
                    {product.originalPrice > product.salePrice && (
                      <Typography className="line-through text-[#637381] text-base">
                        {product.originalPrice.toLocaleString()}₫
                      </Typography>
                    )}
                    <Typography className="text-[#212B36] text-base font-semibold">
                      {product.salePrice.toLocaleString()}₫
                    </Typography>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Typography className="text-[#637381] text-lg">
            Không có sản phẩm nào trong danh mục này.
          </Typography>
        </div>
      )}

      <Button
        onClick={() => router.push("/products")}
        className="bg-[#919EAB14] text-[#212B36] rounded-2xl px-[22px] py-[11px] h-12 gap-2 border-none transition-all duration-200 flex mx-auto hover:bg-[#1A1F2C] hover:text-white"
      >
        Xem tất cả <MdOutlineArrowOutward />
      </Button>
      <ShoppingCartDrawer
        open={isCartOpen}
        onClose={() => dispatch(setCartOpen(false))}
      />
    </div>
  );
}
