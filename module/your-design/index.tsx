import "./index.scss";
import {COLOR_CANDLE_OPTIONS} from "@app/constants";
import {addToCart, setCartOpen} from "@app/redux/slices/CartSlice";
import {setOrderSummary} from "@app/redux/slices/PaymentSlice";
import {IRootState} from "@app/redux/store";
import {Step1ColorPickerComponent} from "@components/YourDesign/Step1ColorPickerComponent";
import {Step2ScentSelectorComponent} from "@components/YourDesign/Step2ScentSelectorComponent";
import {Step3LabelDesignComponent} from "@components/YourDesign/Step3LabelDesignComponent";
import {Step4PreviewComponent} from "@components/YourDesign/Step4PreviewComponent";
import {Col, Row, notification} from "antd";
import axios from "axios";
import Image from "next/image";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

interface Color {
  id: string;
  name: string;
  hexCode: string;
}

interface Scent {
  id: string;
  name: string;
}

interface BaseProduct {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  colors: Array<{color: Color}>;
  scents: Array<{scent: Scent}>;
}

export function YourDesign(): JSX.Element {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedColor, setSelectedColor] = useState("dustyRose");
  const [selectedScents, setSelectedScents] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState<"M" | "L">("M");
  const [quantity, setQuantity] = useState(1);
  const [approved, setApproved] = useState(false);

  // New state for Prisma integration
  const [baseProduct, setBaseProduct] = useState<BaseProduct | null>(null);
  const [availableColors, setAvailableColors] = useState<Color[]>([]);
  const [availableScents, setAvailableScents] = useState<Scent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(239000);

  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: IRootState) => state.user);

  // Fetch base product and customization options
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch base product and customization options
        const [baseProductRes, optionsRes] = await Promise.all([
          axios.get("/api/custom-products?action=base-product"),
          axios.get("/api/custom-products?action=options"),
        ]);

        setBaseProduct(baseProductRes.data);
        setAvailableColors(optionsRes.data.colors);
        setAvailableScents(optionsRes.data.scents);
      } catch (error) {
        console.error("Error fetching data:", error);
        notification.error({
          message: "Lỗi tải dữ liệu",
          description: "Không thể tải thông tin sản phẩm. Vui lòng thử lại!",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate dynamic pricing based on selections
  useEffect(() => {
    if (!baseProduct) return;

    let price = baseProduct.salePrice;

    // Logo size fees: Vừa (M) = 0, Lớn (L) = 80.000đ
    const logoSizeFees = {M: 0, L: 80000};
    price += logoSizeFees[logoSize];

    // Không cộng thêm tiền khi chọn nhiều mùi hương

    // Custom image fee
    if (uploadedImage) {
      price += 25000;
    }

    setCurrentPrice(price);
  }, [baseProduct, logoSize, selectedScents.length, uploadedImage]);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const toggleScent = (scent: string) => {
    setSelectedScents((prev) => {
      if (prev.includes(scent)) {
        return prev.filter((s) => s !== scent);
      }
      if (prev.length < 3) {
        return [...prev, scent];
      }
      return prev;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedImg =
    COLOR_CANDLE_OPTIONS.find((item) => item.value === selectedColor)?.img ||
    "/img/your-design/candle-nude.jpg";

  const getColorLabel = () =>
    COLOR_CANDLE_OPTIONS.find((item) => item.value === selectedColor)?.label ||
    "dustyRose";

  const getLogoSizeLabel = () => {
    if (logoSize === "L") return "Lớn";
    return "Vừa";
  };

  // Handle product submission to cart
  const handleSubmit = async () => {
    if (!baseProduct || !user?.user?.id) {
      notification.error({
        message: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để thực hiện mua hàng",
      });
      router.push("/login");
      return;
    }

    if (selectedScents.length === 0) {
      notification.error({
        message: "Thiếu thông tin",
        description: "Vui lòng chọn ít nhất một mùi hương",
      });
      return;
    }

    try {
      setSubmitting(true);

      // Get selected color and scents details
      const selectedColorObj = availableColors.find(
        (c) => c.name.toLowerCase() === selectedColor.toLowerCase(),
      );
      const selectedScentObjs = availableScents.filter((s) =>
        selectedScents.includes(s.name),
      );

      // Create custom product name
      const productName = title
        ? `Nến Thơm "${title}" - Tùy Chỉnh`
        : `Nến Thơm ${selectedColorObj?.name || selectedColor} - Tùy Chỉnh`;

      // Create cart item with customization metadata (based on base product)
      const uniqueSlug = `custom-product-${Date.now()}`;
      const cartItem = {
        id: `custom-${Date.now()}`,
        productId: baseProduct.id, // id thật của sản phẩm gốc
        productSlug: uniqueSlug, // Slug unique cho mỗi custom product
        name: productName,
        salePrice: currentPrice,
        thumbnailUrl: selectedImg,
        quantity,
        selectedScents: selectedScents,
        selectedColors: [selectedColor],
        customization: {
          selectedColor,
          selectedColorId: selectedColorObj?.id,
          selectedScents,
          selectedScentIds: selectedScentObjs.map((s) => s.id),
          title,
          logoSize,
          uploadedImage,
          isCustomProduct: true,
          baseProductId: baseProduct.id,
          pricing: {
            basePrice: baseProduct.salePrice,
            logoSizeFee: logoSize === "L" ? 80000 : 0,
            multiScentFee: 0,
            customImageFee: uploadedImage ? 25000 : 0,
            totalPrice: currentPrice,
          },
        },
      } as any;

      // Add to cart directly without creating new product in database
      dispatch(addToCart(cartItem));
      dispatch(setCartOpen(true));

      // Calculate order summary for potential immediate purchase
      const itemTotal = currentPrice * quantity;
      const orderSummary = {
        subtotal: itemTotal,
        discount: 0,
        discountPercentage: 0,
        total: itemTotal,
        shippingFee: 0,
        finalTotal: itemTotal,
      };

      dispatch(setOrderSummary(orderSummary));

      notification.success({
        message: "Đã thêm vào giỏ hàng!",
        description: `${productName} x${quantity}`,
        duration: 3,
      });

      // Chuyển về trang chủ sau khi thêm vào giỏ hàng
      router.push("/");
    } catch (error) {
      console.error("Error adding custom product to cart:", error);
      notification.error({
        message: "Có lỗi xảy ra",
        description: "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-20 md:pb-[120px] flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-20 md:pb-[120px]">
        <Row gutter={[32, 32]} align="top">
          <Col
            xs={24}
            md={10}
            lg={12}
            className="flex justify-center md:justify-end"
          >
            <div className="w-full max-w-[564px] aspect-square relative">
              <Image
                src={selectedImg}
                alt="Preview"
                fill
                className="rounded-lg object-contain"
              />
            </div>
          </Col>

          <Col xs={24} md={14} lg={12}>
            {currentStep === 0 && (
              <Step1ColorPickerComponent
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                onNext={handleNext}
                availableColors={availableColors}
              />
            )}

            {currentStep === 1 && (
              <Step2ScentSelectorComponent
                selectedScents={selectedScents}
                toggleScent={toggleScent}
                onNext={handleNext}
                onBack={handleBack}
                availableScents={availableScents}
              />
            )}

            {currentStep === 2 && (
              <Step3LabelDesignComponent
                title={title}
                setTitle={setTitle}
                uploadedImage={uploadedImage}
                handleImageUpload={handleImageUpload}
                logoSize={logoSize}
                setLogoSize={setLogoSize}
                onBack={handleBack}
                onNext={handleNext}
              />
            )}

            {currentStep === 3 && (
              <Step4PreviewComponent
                selectedColor={getColorLabel()}
                selectedColorImage={selectedImg}
                selectedScents={selectedScents}
                title={title}
                logoSize={getLogoSizeLabel() as "Vừa" | "Lớn"}
                quantity={quantity}
                onQuantityChange={setQuantity}
                approved={approved}
                onApproveChange={setApproved}
                onBack={handleBack}
                onSubmit={handleSubmit}
                submitting={submitting}
                baseProduct={baseProduct}
              />
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
}
