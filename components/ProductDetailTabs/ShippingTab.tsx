import {Typography} from "antd";

export default function ShippingTab() {
  return (
    <div className="pt-6  space-y-4">
      <Typography className="text-[#212B36] text-sm">
        Đối với các đơn đặt hàng trên 100 cây nến, vui lòng liên hệ với chúng
        tôi theo thông tin:
      </Typography>
      <div className="space-y-1 pl-4">
        <Typography className="text-[#212B36] text-sm">
          Email: info@artexhibition.com
        </Typography>
        <Typography className="text-[#212B36] text-sm">
          Điện thoại: (+84) 345 622 999
        </Typography>
      </div>
      <Typography className="text-[#212B36] text-sm">
        Miễn phí vận chuyển tiêu chuẩn. Hiện tại, Homesick By You chỉ vận chuyển
        đến các địa chỉ ở Hoa Kỳ. Vui lòng đợi 3–5 ngày làm việc để xử lý và vận
        chuyển các đơn đặt hàng tùy chỉnh.
      </Typography>
    </div>
  );
}
