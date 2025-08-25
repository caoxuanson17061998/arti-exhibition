"use client";

import "./index.scss";
import {
  LeftOutlined,
  MinusOutlined,
  PlusOutlined,
  RightOutlined,
  ShoppingCartOutlined,
  StarFilled,
} from "@ant-design/icons";
import {addToCart, setCartOpen} from "@app/redux/slices/CartSlice";
import {setOrderSummary} from "@app/redux/slices/PaymentSlice";
import {IRootState} from "@app/redux/store";
import DescriptionTab from "@components/ProductDetailTabs/DescriptionTab";
import ShippingTab from "@components/ProductDetailTabs/ShippingTab";
import ShoppingCartDrawer from "@components/ShoppingCartDrawer";
import {
  Button,
  Col,
  Divider,
  InputNumber,
  Rate,
  Row,
  Spin,
  Tabs,
  Tag,
  Typography,
  notification,
} from "antd";
import clsx from "clsx";
import Image from "next/image";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {FaCheck, FaFacebookF, FaInstagram, FaTiktok} from "react-icons/fa";
import {SiThreads} from "react-icons/si";
import {useDispatch, useSelector} from "react-redux";

const {Text} = Typography;

interface ProductDetailProps {
  id: string;
  onBack?: () => void;
}

export function ProductDetail({id, onBack}: ProductDetailProps): JSX.Element {
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState("1");
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const isCartOpen = useSelector((state: IRootState) => state.cart.isCartOpen);
  const user = useSelector((state: IRootState) => state.user);

  const dispatch = useDispatch();
  const router = useRouter();

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const toggleColor = (color: string): void => {
    setSelectedColors((prev) => (prev.includes(color) ? [] : [color]));
  };

  const toggleSize = (size: string): void => {
    setSelectedSize(size);
  };

  const nextImage = () => {
    setSelectedImageIdx((prev) => (prev + 1) % (allImages.length || 1));
  };

  const prevImage = () => {
    setSelectedImageIdx((prev) =>
      prev === 0 ? (allImages.length || 1) - 1 : prev - 1,
    );
  };

  const handleAddToCart = () => {
    if (!productData) return;

    // Gộp thông tin sản phẩm với các lựa chọn và số lượng
    const cartItem = {
      ...productData,
      quantity,
      selectedColors,
      selectedSize,
    };
    dispatch(addToCart(cartItem));
    dispatch(setCartOpen(true));

    notification.success({
      message: "Đã thêm vào giỏ hàng!",
      description: `${productData.name} x${quantity}`,
      duration: 2,
    });
  };

  const handleBuyNow = async () => {
    if (!productData) return;

    // Validate quantity
    if (quantity < 1) {
      notification.error({
        message: "Số lượng không hợp lệ",
        description: "Vui lòng chọn số lượng ít nhất là 1",
      });
      return;
    }

    // Check if user is logged in
    if (!user?.user?.id) {
      notification.error({
        message: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để thực hiện mua hàng",
      });
      router.push("/login");
      return;
    }

    setBuyNowLoading(true);

    try {
      // Create cart item for immediate purchase
      const cartItem = {
        ...productData,
        quantity,
        selectedColors,
        selectedSize,
      };

      // Add to cart first
      dispatch(addToCart(cartItem));

      // Calculate order summary
      const itemPrice = productData.salePrice * quantity;
      const orderSummary = {
        subtotal: itemPrice,
        discount: 0,
        discountPercentage: 0,
        total: itemPrice,
        shippingFee: 0, // Will be calculated in payment step
        finalTotal: itemPrice,
      };

      // Set order summary in payment state
      dispatch(setOrderSummary(orderSummary));

      notification.success({
        message: "Chuyển đến thanh toán",
        description: `Đang mua ${productData.name} x${quantity}`,
        duration: 1.5,
      });

      // Navigate to payment page
      setTimeout(() => {
        router.push("/payment");
      }, 500);
    } catch (error) {
      console.error("Buy now error:", error);
      notification.error({
        message: "Có lỗi xảy ra",
        description: "Không thể chuyển đến trang thanh toán. Vui lòng thử lại!",
      });
    } finally {
      setBuyNowLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?id=${id}`);
        const data = await res.json();
        if (res.ok) {
          setProductData(data);
          window.scrollTo({top: 0, behavior: "smooth"});
        } else {
          console.error("Fetch error:", data.error);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // Set default size when product data loads
  useEffect(() => {
    if (productData?.sizes?.length > 0 && !selectedSize) {
      setSelectedSize(
        productData.sizes[0].size?.name || productData.sizes[0].name,
      );
    }
  }, [productData, selectedSize]);

  if (loading) {
    return (
      <div className="w-full bg-white">
        {/* Back to Products */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {onBack && (
              <button
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                onClick={onBack}
              >
                <LeftOutlined />
                <span className="text-sm sm:text-base">Quay lại sản phẩm</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="w-full bg-white">
        {/* Back to Products */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {onBack && (
              <button
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                onClick={onBack}
              >
                <LeftOutlined />
                <span className="text-sm sm:text-base">Quay lại sản phẩm</span>
              </button>
            )}
          </div>
        </div>
        <div className="text-center py-20">
          <Typography.Title level={3}>Không tìm thấy sản phẩm</Typography.Title>
        </div>
      </div>
    );
  }

  const {
    name,
    description,
    originalPrice,
    salePrice,
    imageUrls = [],
    thumbnailUrl,
  } = productData;

  // Gộp thumbnailUrl và imageUrls thành một mảng, ưu tiên thumbnailUrl đầu tiên
  const allImages = [
    ...(thumbnailUrl ? [thumbnailUrl] : []),
    ...(Array.isArray(imageUrls) ? imageUrls : []),
  ];

  // Chỉ lấy danh sách từ API
  const colorList = Array.isArray(productData.colors)
    ? productData.colors.map((c: any) => ({
        label: c.color?.name,
        value: c.color?.hexCode,
        hex: c.color?.hexCode,
      }))
    : [];

  const sizeList = Array.isArray(productData.sizes)
    ? productData.sizes.map((s: any) => ({
        label: s.size?.name || s.name,
        value: s.size?.name || s.name,
        id: s.size?.id || s.sizeId,
      }))
    : [];

  // Khai báo tabItems sau khi đã có productData
  const tabItems = [
    {
      key: "1",
      label: "Mô tả sản phẩm",
      children: (
        <DescriptionTab
          productInfo={[]}
          description={productData.description || ""}
        />
      ),
    },
    {key: "2", label: "Vận chuyển", children: <ShippingTab />},
    // {key: "3", label: "Đánh giás", children: <ReviewsTab />},
  ];

  return (
    <div className="w-full bg-white">
      {/* Back to Products */}
      {onBack && (
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              onClick={onBack}
            >
              <LeftOutlined />
              <span className="text-sm sm:text-base">Quay lại sản phẩm</span>
            </button>
          </div>
        </div>
      )}
      <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-[120px]">
        <Row gutter={[32, 32]}>
          <Col md={12}>
            <div className="w-full aspect-square relative rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={allImages[selectedImageIdx] || "/img/placeholder.png"}
                alt="Product"
                layout="fill"
                objectFit="cover"
              />
              <Button
                onClick={prevImage}
                icon={<LeftOutlined />}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white p-2 rounded-full hover:!bg-black  !w-10 !h-10 hover:!border-[#D8B197]"
              />
              <Button
                onClick={nextImage}
                icon={<RightOutlined />}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white p-2 rounded-full hover:!bg-black  !w-10 !h-10 hover:!border-[#D8B197]"
              />
            </div>

            <div className="flex gap-3 mt-4">
              {allImages.map((img: string, idx: number) => (
                <Button
                  key={idx}
                  className={clsx(
                    "relative w-[60px] h-[60px] rounded-md border-2 overflow-hidden cursor-pointer transition-all",
                    selectedImageIdx === idx
                      ? "border-[#D8B197]"
                      : "border-transparent hover:border-gray-300",
                  )}
                  onClick={() => setSelectedImageIdx(idx)}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </Button>
              ))}
            </div>
          </Col>

          <Col md={12} className="py-10 px-4 md:px-0">
            <div className="flex flex-col gap-4">
              <Tag className="w-fit px-1.5 py-[2px] text-[#D32F2F] bg-[#F4433629] border-none rounded-md">
                SALE
              </Tag>
              <Typography className="text-[#4CAF50] text-xs font-bold">
                CÒN HÀNG
              </Typography>
              <Typography className="text-[#212B36] text-xl font-bold">
                {name}
              </Typography>
              <div className="flex items-center gap-2 mb-4">
                <Rate
                  allowHalf
                  defaultValue={4}
                  disabled
                  character={<StarFilled />}
                  className="text-[#FF9800] text-xl leading-none"
                />
                <Text className="text-[#637381] text-sm">
                  (11.78K Đánh giá)
                </Text>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Text
                  delete
                  className="text-[#919EAB] text-xl md:text-2xl font-bold"
                >
                  {originalPrice?.toLocaleString()}đ
                </Text>
                <Text
                  strong
                  className="text-[#212B36] text-xl md:text-2xl font-bold"
                >
                  {salePrice?.toLocaleString()}đ
                </Text>
              </div>
              {quantity > 1 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
                  <Text className="text-green-800 text-sm">
                    Tổng cộng ({quantity} sản phẩm):{" "}
                    <span className="font-bold">
                      {(salePrice * quantity)?.toLocaleString()}đ
                    </span>
                  </Text>
                </div>
              )}
              <Typography className="text-[#637381] text-sm">
                {description}
              </Typography>
            </div>

            <Divider dashed style={{borderColor: "#91EAB3D"}} />

            <div className="mt-6">
              <Typography className="font-semibold text-sm text-[#212B36] mb-3">
                Màu sắc
              </Typography>
              <div className="flex gap-2 flex-wrap">
                {colorList.map((color: any) => (
                  <Tag
                    key={color.value}
                    onClick={() => toggleColor(color.value)}
                    className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer flex items-center justify-center relative"
                    style={{backgroundColor: color.hex || color.value}}
                  >
                    {selectedColors.includes(color.value) && (
                      <FaCheck
                        className={`pointer-events-none text-base ${
                          ["#fff", "#FFF", "#ffffff", "#FFFFFF"].includes(
                            (color.hex || color.value)?.toLowerCase(),
                          )
                            ? "text-black"
                            : "text-white"
                        }`}
                      />
                    )}
                  </Tag>
                ))}
              </div>
            </div>

            {sizeList.length > 0 && (
              <div className="mt-6">
                <Typography className="font-semibold text-sm text-[#212B36] mb-3">
                  Kích thước
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {sizeList.map((size: any) => (
                    <Tag
                      key={size.value}
                      bordered={false}
                      onClick={() => toggleSize(size.value)}
                      className={clsx(
                        "cursor-pointer rounded-[6px] px-3 py-2 text-sm transition",
                        {
                          "bg-[#E1BDA929] text-[#D38B65] border-[#D38B65]":
                            selectedSize === size.value,
                          "bg-[#919EAB29] text-[#637381] border-[#919EAB29]":
                            selectedSize !== size.value,
                        },
                      )}
                    >
                      {size.label}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            <Divider dashed style={{borderColor: "#91EAB3D"}} />

            <Button
              type="default"
              onClick={handleAddToCart}
              icon={<ShoppingCartOutlined />}
              className="rounded-2xl h-12 w-full py-3 mb-2 hover:!text-[#212B36] hover:!border-[#212B36]"
            >
              <Typography className="text-base text-[#212B36] leading-[26px]">
                Thêm vào giỏ hàng
              </Typography>
            </Button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 px-3 py-1.5 rounded-2xl w-[120px] justify-between">
                <Button
                  icon={<MinusOutlined />}
                  size="small"
                  className="border-none p-0"
                  onClick={decreaseQuantity}
                  type="text"
                />
                <InputNumber
                  min={1}
                  value={quantity}
                  controls={false}
                  className="w-10 text-center border-none shadow-none"
                />
                <Button
                  icon={<PlusOutlined />}
                  size="small"
                  className="border-none p-0"
                  onClick={increaseQuantity}
                  type="text"
                />
              </div>

              <Button
                type="primary"
                loading={buyNowLoading}
                onClick={handleBuyNow}
                disabled={!productData || quantity < 1}
                className="bg-[#212B36] hover:!bg-[#37424B] text-white rounded-2xl h-[44px] flex-1 flex items-center justify-center transition-colors duration-200 disabled:!bg-gray-400 disabled:!border-gray-400"
              >
                {buyNowLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Đang xử lý...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <path
                        d="M2 2h2l.4 2M6 6h6l2-5H4.4M6 6L4.4 4H2M6 6l-1 5h8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="9"
                        cy="13"
                        r="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="5"
                        cy="13"
                        r="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    Mua ngay
                  </span>
                )}
              </Button>
            </div>

            <div className="flex justify-center items-center">
              <FaFacebookF className="text-[#637381] text-2xl m-2" />
              <FaInstagram className="text-[#637381] text-2xl m-2" />
              <SiThreads className="text-[#637381] text-2xl m-2" />
              <FaTiktok className="text-[#637381] text-2xl m-2" />
            </div>
          </Col>
        </Row>

        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={tabItems}
          className="product-detail-tabs mt-10"
        />
      </div>

      <ShoppingCartDrawer
        open={isCartOpen}
        onClose={() => dispatch(setCartOpen(false))}
      />
    </div>
  );
}
