import {IRootState} from "@app/redux/store";
import {logoutUser} from "@slices/UserSlice";
import {Layout, Popover, notification} from "antd";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/router";
import {useState} from "react";
import {FiMenu, FiSearch, FiShoppingBag, FiX} from "react-icons/fi";
import {useDispatch, useSelector} from "react-redux";

const {Header} = Layout;

export default function HeaderComponent() {
  const router = useRouter();
  const {user} = useSelector((state: IRootState) => state.user);
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const content = () => {
    return (
      <div className="flex flex-col w-40">
        <div
          role="presentation"
          className="text-base cursor-pointer hover:bg-[#E1BDA9] p-2 rounded-xl hover:text-white"
          onClick={() => {
            if (user?.email) {
              // Handle logout logic here
              dispatch(logoutUser());
              notification.success({
                message: "Đăng xuất thành công!",
              });
            } else {
              router.push("/login");
            }
          }}
        >
          {user?.email ? "Đăng xuất" : "Đăng nhập"}
        </div>
        {user?.email && user?.role !== "admin" && (
          <div
            onClick={() => router.push("/history")}
            role="presentation"
            className="text-base cursor-pointer hover:bg-[#E1BDA9] p-2 rounded-xl hover:text-white"
          >
            Lịch sử mua hàng
          </div>
        )}

        {user?.email && user?.role === "admin" && (
          <div
            role="presentation"
            onClick={() => router.push("/dashboard")}
            className="text-base cursor-pointer hover:bg-[#E1BDA9] p-2 rounded-xl hover:text-white"
          >
            Truy cập quản trị
          </div>
        )}
      </div>
    );
  };

  return (
    <Header className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-sm p-0">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-20 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left - Logo */}
          <div className="flex items-center gap-2 h-full">
            <Link href="/">
              <div className="flex items-center gap-2">
                <div className="h-full">
                  {/* <img
                    src="/img/logo.png"
                    alt="Art Exhibition Logo"
                    className="w-full h-full object-cover"
                  /> */}

                  <Image
                    src="/img/logo.svg"
                    alt="Art Exhibition Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-white hover:text-[#FF8E1A] transition-colors "
            >
              Trang chủ
            </Link>
            <Link
              href="/products"
              className="text-white hover:text-[#FF8E1A] transition-colors "
            >
              Cửa hàng
            </Link>
            <Link
              href="/charity"
              className="text-white hover:text-[#FF8E1A] transition-colors "
            >
              Sứ mệnh
            </Link>
            <Link
              href="/blog"
              className="text-white hover:text-[#FF8E1A] transition-colors "
            >
              Blog
            </Link>
          </nav>

          {/* Right - Icons and Menu */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search Icon */}
            <button className="p-2 text-white hover:text-[#FF8E1A] transition-colors">
              <FiSearch className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Cart Icon */}
            {/* <div className="relative"> */}
            <button
              className="p-2 text-white hover:text-[#FF8E1A] transition-colors"
              onClick={() => router.push("/cart-checkout")}
            >
              <FiShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            {/* Cart Badge */}
            {/* {cart?.length > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#0EC1AF] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{cart.length}</span>
                </div>
              )} */}
            {/* </div> */}

            {/* Desktop User Menu */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="w-px h-4 bg-white/30"></div>
              <Popover
                content={content}
                placement="bottomRight"
                trigger="click"
              >
                <button className="flex items-center gap-2 text-white hover:text-[#FF8E1A] transition-colors">
                  {user && (
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm ">
                        {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                  )}
                  <span className="text-sm ">
                    {user?.email ? "Tài khoản" : "Đăng nhập"}
                  </span>
                </button>
              </Popover>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-white hover:text-[#FF8E1A] transition-colors"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/48 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Drawer */}
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl flex flex-col h-screen">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-dashed border-gray-300">
                <div className="flex items-center">
                  <Image
                    src="/img/small-logo.svg"
                    alt="Art Exhibition Logo"
                    width={174}
                    height={33}
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Menu Content */}
              <div className="flex-1 p-2">
                {/* Menu Items */}
                <nav className="space-y-1">
                  <Link
                    href="/"
                    className="relative flex items-center px-3 py-1.5 rounded-md text-gray-900 hover:bg-[#FF8E1A] hover:text-white transition-colors "
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="absolute left-0 w-1.5 h-1.5 bg-[#FF8E1A] rounded-full" />
                    <span className="ml-4">Trang chủ</span>
                  </Link>
                  <Link
                    href="/products"
                    className="flex items-center px-3 py-1.5 rounded-md text-gray-600 hover:bg-[#FF8E1A] hover:text-white transition-colors "
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="ml-4">Cửa hàng</span>
                  </Link>
                  <Link
                    href="/charity"
                    className="flex items-center px-3 py-1.5 rounded-md text-gray-600 hover:bg-[#FF8E1A] hover:text-white transition-colors "
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="ml-4">Từ thiện</span>
                  </Link>
                  <Link
                    href="/blog"
                    className="flex items-center px-3 py-1.5 rounded-md text-gray-600 hover:bg-[#FF8E1A] hover:text-white transition-colors "
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="ml-4">Blog</span>
                  </Link>
                </nav>
              </div>

              {/* Action Buttons */}
              <div className="p-5 space-y-2">
                {!user?.email ? (
                  <>
                    <button
                      onClick={() => {
                        router.push("/login");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-3 px-6 border border-gray-300 rounded-2xl text-gray-900 bg-white hover:bg-gray-50 transition-colors  text-sm"
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => {
                        router.push("/login");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-3 px-6 bg-[#FF8E1A] text-white rounded-2xl hover:bg-[#e67e0a] transition-colors  text-sm"
                    >
                      Đăng ký
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        router.push("/history");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-3 px-6 border border-gray-300 rounded-2xl text-gray-900 bg-white hover:bg-gray-50 transition-colors  text-sm"
                    >
                      Lịch sử mua hàng
                    </button>
                    {user.role === "admin" && (
                      <button
                        onClick={() => {
                          router.push("/dashboard");
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full py-3 px-6 border border-gray-300 rounded-2xl text-gray-900 bg-white hover:bg-gray-50 transition-colors  text-sm"
                      >
                        Truy cập quản trị
                      </button>
                    )}
                    <button
                      onClick={() => {
                        dispatch(logoutUser());
                        notification.success({
                          message: "Đăng xuất thành công!",
                        });
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-3 px-6 bg-[#FF8E1A] text-white rounded-2xl hover:bg-[#e67e0a] transition-colors  text-sm"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Header>
  );
}
