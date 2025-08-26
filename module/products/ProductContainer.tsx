import {
  ArrowRightOutlined,
  DownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {SORT_OPTIONS} from "@app/constants";
import {IRootState} from "@app/redux/store";
import {Product, ProductCategory} from "@app/types";
import FilterDrawer from "@components/FilterDrawer";
import ShoppingCartDrawer from "@components/ShoppingCartDrawer";
import {useCategoriesQuery} from "@module/home/useDashboardQueries";
import {addToCart, setCartOpen} from "@slices/CartSlice";
import {Button, Dropdown, Input, Spin, Typography} from "antd";
import axios from "axios";
import {useRouter} from "next/router";
import qs from "qs";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {FiFilter} from "react-icons/fi";
import {useDispatch, useSelector} from "react-redux";

interface ProductProps {
  onProductClick?: (id: string) => void;
}

export function ProductContainer({onProductClick}: ProductProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isCartOpen = useSelector((state: IRootState) => state.cart.isCartOpen);

  // Helper function to compare query objects
  const areQueriesEqual = (query1: any, query2: any) => {
    // Normalize the queries by removing empty values
    const normalize = (obj: any) => {
      const normalized: any = {};
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          !(Array.isArray(value) && value.length === 0)
        ) {
          normalized[key] = Array.isArray(value) ? value.sort() : value;
        }
      });
      return normalized;
    };

    const norm1 = normalize(query1);
    const norm2 = normalize(query2);

    const keys1 = Object.keys(norm1).sort();
    const keys2 = Object.keys(norm2).sort();

    if (keys1.length !== keys2.length) return false;

    for (let i = 0; i < keys1.length; i++) {
      if (keys1[i] !== keys2[i]) return false;

      const val1 = norm1[keys1[i]];
      const val2 = norm2[keys2[i]];

      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (val1.length !== val2.length) return false;
        for (let j = 0; j < val1.length; j++) {
          if (val1[j] !== val2[j]) return false;
        }
      } else if (val1 !== val2) {
        return false;
      }
    }

    return true;
  };

  const [openFilter, setOpenFilter] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Sắp xếp");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Products per page - adjustable
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<[number, number]>([
    0, 1280000,
  ]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<any>(null);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(
    undefined,
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const updatingUrl = useRef(false);

  // State tạm thời cho Drawer (pending)
  const [pendingColors, setPendingColors] = useState<string[]>([]);
  const [pendingSizes, setPendingSizes] = useState<string[]>([]);
  const [pendingPrice, setPendingPrice] = useState<[number, number]>([
    0, 1280000,
  ]);

  // Fetch products and categories from API
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategoriesQuery();

  // Initialize filters from URL query parameters
  useEffect(() => {
    if (router.isReady && !isInitialized && !updatingUrl.current) {
      const {
        categoryId,
        colors,
        sizes,
        minPrice,
        maxPrice,
        sortBy: urlSortBy,
        sortOrder: urlSortOrder,
      } = router.query;

      let hasFilters = false;

      if (categoryId && typeof categoryId === "string") {
        setSelectedCategoryId(categoryId);
        hasFilters = true;
      }

      if (colors) {
        const colorArray = Array.isArray(colors) ? colors : [colors];
        setSelectedColors(colorArray as string[]);
        hasFilters = true;
      }

      if (sizes) {
        const sizeArray = Array.isArray(sizes) ? sizes : [sizes];
        setSelectedSizes(sizeArray as string[]);
        hasFilters = true;
      }

      if (minPrice && maxPrice) {
        const min = parseInt(minPrice as string, 10) || 0;
        const max = parseInt(maxPrice as string, 10) || 1280000;
        setSelectedPrice([min, max]);
        hasFilters = true;
      }

      if (urlSortBy && urlSortOrder) {
        setSortBy(urlSortBy as string);
        setSortOrder(urlSortOrder as "asc" | "desc");
        hasFilters = true;
      }

      setIsInitialized(true);
    }
  }, [router.isReady, router.query, isInitialized]);

  // Update URL when filters change
  useEffect(() => {
    if (!router.isReady || !isInitialized) return;

    const query: any = {};

    if (selectedCategoryId) query.categoryId = selectedCategoryId;
    if (selectedColors.length > 0) query.colors = selectedColors;
    if (selectedSizes.length > 0) query.sizes = selectedSizes;
    if (selectedPrice[0] > 0 || selectedPrice[1] < 1280000) {
      const [minPrice, maxPrice] = selectedPrice;
      query.minPrice = minPrice;
      query.maxPrice = maxPrice;
    }
    if (sortBy) query.sortBy = sortBy;
    if (sortOrder) query.sortOrder = sortOrder;

    // Only update URL if the query has actually changed
    if (!areQueriesEqual(router.query, query)) {
      updatingUrl.current = true;
      router
        .push({pathname: router.pathname, query}, undefined, {shallow: true})
        .finally(() => {
          updatingUrl.current = false;
        });
    }
  }, [
    selectedCategoryId,
    selectedColors,
    selectedSizes,
    selectedPrice,
    sortBy,
    sortOrder,
    router.isReady,
    isInitialized,
  ]);

  // Fetch products when filter changes
  useEffect(() => {
    if (!isInitialized) return;

    setIsLoadingProducts(true);
    setProductsError(null);
    setCurrentPage(1); // Reset to first page when filters change
    const params: any = {};
    if (selectedColors.length > 0) params.colorId = selectedColors;
    if (selectedSizes.length > 0) params.size = selectedSizes;
    if (selectedPrice && (selectedPrice[0] > 0 || selectedPrice[1] < 1280000)) {
      const [minPrice, maxPrice] = selectedPrice;
      params.minPrice = minPrice;
      params.maxPrice = maxPrice;
    }
    if (selectedCategoryId) params.categoryId = selectedCategoryId;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    axios
      .get("/api/products", {
        params,
        paramsSerializer: (params) =>
          qs.stringify(params, {arrayFormat: "repeat"}),
      })
      .then((res) => setProducts(res.data))
      .catch((err) => setProductsError(err))
      .finally(() => setIsLoadingProducts(false));
  }, [
    selectedColors,
    selectedSizes,
    selectedPrice,
    selectedCategoryId,
    sortBy,
    sortOrder,
    isInitialized,
  ]);

  // Khi mở Drawer, đồng bộ state pending với state thực tế
  React.useEffect(() => {
    if (openFilter) {
      setPendingColors(selectedColors);
      setPendingSizes(selectedSizes);
      setPendingPrice(selectedPrice);
    }
  }, [openFilter]);

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

  // Get selected category name for display
  const getSelectedCategoryName = () => {
    if (!selectedCategoryId) return "Tất cả danh mục";
    const category = categories.find((c) => c.id === selectedCategoryId);
    return category ? category.name : "Tất cả danh mục";
  };

  // Create category dropdown options
  const categoryDropdownItems = useMemo(
    () => [
      {
        key: "all",
        label: (
          <div className="flex items-center gap-2">
            <span>Tất cả danh mục</span>
            {!selectedCategoryId && (
              <span className="text-[#0EC1AF] text-xs">✓</span>
            )}
          </div>
        ),
        onClick: () => setSelectedCategoryId(undefined),
      },
      ...categories.map((category) => ({
        key: category.id,
        label: (
          <div className="flex items-center gap-2">
            <span>{category.name}</span>
            {selectedCategoryId === category.id && (
              <span className="text-[#0EC1AF] text-xs">✓</span>
            )}
          </div>
        ),
        onClick: () => setSelectedCategoryId(category.id),
      })),
    ],
    [categories, selectedCategoryId],
  );

  // Calculate total pages based on items per page
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Ensure current page doesn't exceed total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Combined loading and error states
  const isLoading = isLoadingProducts || isLoadingCategories;
  const hasError = productsError || categoriesError;

  if (isLoading) {
    return (
      <div className="w-full bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-[120px] flex justify-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-full bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-[120px] text-center">
          <Typography className="text-red-500">
            Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
          </Typography>
        </div>
      </div>
    );
  }

  const handleProductClick = (id: string) => {
    if (onProductClick) {
      onProductClick(id);
    }
  };

  return (
    <>
      <div className="w-full bg-white">
        {/* Shop Title Section */}
        <div className="w-full bg-white py-[60px] md:py-[120px] px-0">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col items-center gap-2">
              <Typography className="text-[32px] md:text-[48px] font-bold text-[#212B36] text-center leading-[1.33]">
                Khám Phá Bộ Sưu Tập Tranh 2D Độc Đáo
              </Typography>
              <Typography className="text-[16px] md:text-[20px] font-bold text-[#212B36] text-center leading-[1.5] max-w-[600px]">
                Nơi mỗi tác phẩm nghệ thuật kể một câu chuyện riêng và biến
                không gian của bạn thành một phòng trưng bày cá nhân.
              </Typography>

              {/* Category Breadcrumb */}
              {selectedCategoryId && (
                <div className="flex items-center gap-2 mt-4 text-sm">
                  <span className="text-[#637381]">Trang chủ</span>
                  <ArrowRightOutlined className="text-[#637381] text-xs" />
                  <span className="text-[#637381]">Sản phẩm</span>
                  <ArrowRightOutlined className="text-[#637381] text-xs" />
                  <span className="text-[#0EC1AF] font-semibold">
                    {getSelectedCategoryName()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-full bg-white py-5 md:py-10 pb-[60px] md:pb-[120px]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col gap-6 md:gap-10">
              {/* Filter and Sort Controls */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
                {/* Category Filter */}
                <div className="w-full md:w-[320px]">
                  <Dropdown
                    menu={{
                      items: categoryDropdownItems,
                    }}
                    trigger={["click"]}
                    disabled={isLoadingCategories}
                  >
                    <Button
                      loading={isLoadingCategories}
                      className="w-full h-12 rounded-[10px] border border-[rgba(145,158,171,0.32)] bg-white text-left px-3 flex items-center justify-between hover:!border-[#0EC1AF] hover:!text-[#212B36] disabled:cursor-not-allowed"
                    >
                      <span className="text-[#212B36] text-base">
                        {isLoadingCategories
                          ? "Đang tải..."
                          : getSelectedCategoryName()}
                      </span>
                      {!isLoadingCategories && (
                        <DownOutlined className="text-[#212B36]" />
                      )}
                    </Button>
                  </Dropdown>
                </div>

                {/* Filter and Sort Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => setOpenFilter(true)}
                    className="h-9 px-2 rounded-[10px] bg-transparent border-none text-[14px] font-normal text-[#212B36] hover:!bg-[#f5f5f5] hover:!text-[#212B36] flex items-center gap-2"
                  >
                    Lọc
                    <FiFilter className="w-5 h-5" />
                  </Button>

                  <Dropdown
                    menu={{
                      items: SORT_OPTIONS,
                      onClick: (e) => {
                        const selected = SORT_OPTIONS.find(
                          (i) => i.key === e.key,
                        );
                        setSelectedSort(selected?.label || "Sắp xếp");
                        if (e.key === "newest") {
                          setSortBy("createdAt");
                          setSortOrder("desc");
                        } else if (e.key === "oldest") {
                          setSortBy("createdAt");
                          setSortOrder("asc");
                        } else if (e.key === "priceHighToLow") {
                          setSortBy("salePrice");
                          setSortOrder("desc");
                        } else if (e.key === "priceLowToHigh") {
                          setSortBy("salePrice");
                          setSortOrder("asc");
                        } else {
                          setSortBy(undefined);
                          setSortOrder(undefined);
                        }
                      },
                    }}
                    trigger={["click"]}
                  >
                    <Button className="h-9 px-2 rounded-[10px] bg-transparent border-none text-[14px] font-normal text-[#212B36] hover:!bg-[#f5f5f5] hover:!text-[#212B36] flex items-center gap-2">
                      Sắp xếp: Nổi bật
                      <DownOutlined className="w-5 h-5" />
                    </Button>
                  </Dropdown>
                </div>
              </div>

              {/* Results Summary and Clear Filters */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Typography className="text-[#637381] text-sm">
                    Tìm thấy{" "}
                    <span className="font-semibold text-[#212B36]">
                      {products.length}
                    </span>{" "}
                    sản phẩm
                    {selectedCategoryId && (
                      <span>
                        {" "}
                        trong danh mục{" "}
                        <span className="font-semibold text-[#0EC1AF]">
                          {getSelectedCategoryName()}
                        </span>
                      </span>
                    )}
                  </Typography>
                </div>

                {(selectedCategoryId ||
                  selectedColors.length > 0 ||
                  selectedSizes.length > 0 ||
                  selectedPrice[0] > 0 ||
                  selectedPrice[1] < 1280000) && (
                  <Button
                    onClick={() => {
                      // Set flag to prevent URL parsing
                      updatingUrl.current = true;

                      setSelectedCategoryId(undefined);
                      setSelectedColors([]);
                      setSelectedSizes([]);
                      setSelectedPrice([0, 1280000]);
                      setSortBy(undefined);
                      setSortOrder(undefined);
                      setSelectedSort("Sắp xếp");
                      setCurrentPage(1); // Reset to first page

                      // Also reset pending states
                      setPendingColors([]);
                      setPendingSizes([]);
                      setPendingPrice([0, 1280000]);

                      // Clear URL query parameters
                      router
                        .push({pathname: router.pathname}, undefined, {
                          shallow: true,
                        })
                        .finally(() => {
                          updatingUrl.current = false;
                        });
                    }}
                    className="h-8 px-3 rounded-[8px] bg-transparent border border-[#0EC1AF] text-[#0EC1AF] text-sm hover:!bg-[#0EC1AF] hover:!text-white hover:!border-[#0EC1AF]"
                  >
                    Xóa bộ lọc
                  </Button>
                )}
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginatedProducts.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Typography className="text-[#637381] text-lg">
                      Không có sản phẩm nào trong danh mục này.
                    </Typography>
                  </div>
                ) : (
                  paginatedProducts.map((product: Product) => {
                    const tag = getProductTag(product);

                    return (
                      <div key={product.id} className="group relative">
                        {/* Product Card */}
                        <div className="bg-white shadow-[0px_12px_24px_-4px_rgba(145,158,171,0.12),0px_0px_2px_0px_rgba(145,158,171,0.2)] rounded-2xl overflow-hidden h-full flex flex-col">
                          {/* Image Container */}
                          <div className="relative p-2">
                            <div
                              className="w-full h-[246px] rounded-xl bg-cover bg-center relative overflow-hidden"
                              style={{
                                backgroundImage: `url(${
                                  product.thumbnailUrl ||
                                  "/img/home/candles/candle-1.svg"
                                })`,
                              }}
                            >
                              {/* Sale Badge */}
                              {tag === "SALE" && (
                                <div className="absolute top-4 right-4 bg-[#F44336] text-white px-1.5 py-0 rounded-md min-h-6 flex items-center">
                                  <span className="text-xs font-bold leading-[1.67]">
                                    SALE
                                  </span>
                                </div>
                              )}

                              {/* New Badge */}
                              {tag === "NEW" && (
                                <div className="absolute top-4 right-4 bg-[#03A9F4] text-white px-1.5 py-0 rounded-md min-h-6 flex items-center">
                                  <span className="text-xs font-bold leading-[1.67]">
                                    MỚI
                                  </span>
                                </div>
                              )}

                              {/* Hover Add to Cart Button */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
                                <Button
                                  onClick={() => handleAddToCart(product)}
                                  className="w-11 h-11 rounded-full bg-[#0EC1AF] border-[#0EC1AF] hover:!bg-[#0EC1AF] hover:!border-[#0EC1AF] flex items-center justify-center p-0 shadow-[0px_8px_16px_0px_rgba(14,193,175,0.24)]"
                                >
                                  <ShoppingCartOutlined className="text-white text-lg" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="p-3 flex-1 flex flex-col gap-3">
                            {/* Product Title */}
                            <button
                              onClick={() => handleProductClick(product.id)}
                              className="text-left"
                            >
                              <Typography className="text-[#212B36] text-lg font-semibold leading-[1.56] hover:text-[#0EC1AF] transition-colors">
                                {product.name}
                              </Typography>
                            </button>

                            {/* Color and Price Row */}
                            <div className="flex justify-between items-center gap-6">
                              {/* Color Options */}
                              <div className="flex items-center gap-0.5">
                                {product.colors &&
                                  product.colors
                                    .slice(0, 3)
                                    .map((colorItem, index) => (
                                      <div
                                        key={index}
                                        className="relative w-[18px] h-[18px]"
                                      >
                                        <div
                                          className="w-4 h-4 rounded-full absolute top-0.5 left-0.5"
                                          style={{
                                            backgroundColor:
                                              colorItem.color.hexCode,
                                          }}
                                        ></div>
                                        <div className="w-4 h-4 rounded-full absolute top-0.5 left-0.5 border-2 border-white shadow-[inset_-1px_1px_2px_0px_rgba(0,0,0,0.24)]"></div>
                                        <div className="w-4 h-4 rounded-full absolute top-0.5 left-0.5 border-2 border-white"></div>
                                      </div>
                                    ))}
                                {product.colors &&
                                  product.colors.length > 3 && (
                                    <span className="text-sm font-semibold text-[#212B36] w-[18px] h-[14px] leading-[1.57] text-left ml-0.5">
                                      +{product.colors.length - 3}
                                    </span>
                                  )}
                              </div>

                              {/* Price */}
                              <div className="flex gap-1 items-center">
                                {product.originalPrice > product.salePrice && (
                                  <span className="line-through text-[#637381] text-base font-normal leading-[1.5] text-right">
                                    {product.originalPrice.toLocaleString()}₫
                                  </span>
                                )}
                                <span className="text-[#212B36] text-base font-semibold leading-[1.5] text-left">
                                  {product.salePrice.toLocaleString()}₫
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Pagination - Only show if there are products */}
              {products.length > 0 && (
                <div className="flex justify-center">
                  <div className="flex items-center gap-1.5">
                    <Button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="w-8 h-8 rounded-full border-none bg-transparent p-2 flex items-center justify-center hover:!bg-[#f5f5f5] disabled:opacity-50"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M7.5 4.17L4.17 7.5L11.67 15"
                          stroke={currentPage === 1 ? "#637381" : "#212B36"}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>

                    {/* Dynamic pagination based on total pages */}
                    {(() => {
                      const maxVisiblePages = 5;
                      const startPage = Math.max(
                        1,
                        Math.min(
                          currentPage - 2,
                          totalPages - maxVisiblePages + 1,
                        ),
                      );
                      const endPage = Math.min(
                        totalPages,
                        startPage + maxVisiblePages - 1,
                      );
                      const pages = [];

                      for (let page = startPage; page <= endPage; page++) {
                        pages.push(
                          <Button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-full border-none flex items-center justify-center p-0 text-base font-semibold leading-[1.5] ${
                              currentPage === page
                                ? "bg-[#212B36] text-white"
                                : "bg-transparent text-[#212B36] hover:!bg-[#f5f5f5]"
                            }`}
                          >
                            {page}
                          </Button>,
                        );
                      }

                      // Add ellipsis and last page if needed
                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(
                            <span
                              key="ellipsis"
                              className="w-8 h-8 flex items-center justify-center text-base font-semibold text-[#212B36]"
                            >
                              …
                            </span>,
                          );
                        }
                        pages.push(
                          <Button
                            key={totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                            className={`w-8 h-8 rounded-full border-none flex items-center justify-center p-0 text-base font-semibold leading-[1.5] ${
                              currentPage === totalPages
                                ? "bg-[#212B36] text-white"
                                : "bg-transparent text-[#212B36] hover:!bg-[#f5f5f5]"
                            }`}
                          >
                            {totalPages}
                          </Button>,
                        );
                      }

                      return pages;
                    })()}

                    <Button
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="w-8 h-8 rounded-full border-none bg-transparent p-2 flex items-center justify-center hover:!bg-[#f5f5f5] disabled:opacity-50"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M12.5 15.83L15.83 12.5L8.33 5"
                          stroke={
                            currentPage >= totalPages ? "#637381" : "#212B36"
                          }
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <FilterDrawer
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        selectedColors={pendingColors}
        setSelectedColors={setPendingColors}
        sizes={pendingSizes}
        setSizes={setPendingSizes}
        price={pendingPrice}
        setPrice={setPendingPrice}
        onFilterChange={({colors, size, price}) => {
          setSelectedColors(colors);
          setSelectedSizes(size);
          setSelectedPrice(price);
        }}
      />
      <ShoppingCartDrawer
        open={isCartOpen}
        onClose={() => dispatch(setCartOpen(false))}
      />
    </>
  );
}
