import {PageHeader} from "@components/PageHeader";
import {TitledTextBlock} from "@components/TitledTextBlock";
import Link from "next/link";

export function TermOfService(): JSX.Element {
  return (
    <div className="w-full bg-white">
      <PageHeader
        title="Điều khoản & điều kiện"
        subtitle="Khi truy cập và mua hàng tại Art Exhibition, bạn đồng ý tuân thủ các điều khoản và điều kiện sau:"
        backgroundImage="/img/term-of-service.svg"
      />

      <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-[120px]">
        <TitledTextBlock
          title="1. Thông tin sản phẩm"
          content="Chúng tôi cam kết cung cấp thông tin chính xác, đầy đủ về sản phẩm (bao gồm giá, mô tả, hình ảnh và thành phần). Tuy nhiên, màu sắc sản phẩm thực tế có thể chênh lệch nhẹ tùy thuộc vào màn hình hiển thị."
        />
        <TitledTextBlock
          title="2. Đặt hàng và thanh toán"
          content="Thông tin của bạn sẽ chỉ được sử dụng nội bộ trong hệ thống quản lý của chúng tôi. Chúng tôi cam kết không chia sẻ, bán hoặc trao đổi dữ liệu cá nhân với bên thứ ba, trừ khi có yêu cầu từ cơ quan pháp luật hoặc được sự đồng ý của bạn."
        />
        <TitledTextBlock
          title="3. Giao hàng"
          content="Thời gian giao hàng được thông báo ước lượng và có thể thay đổi tùy vào khu vực và điều kiện vận chuyển. Chúng tôi sẽ cố gắng giao hàng đúng hẹn và hỗ trợ kịp thời nếu có phát sinh."
        />
        <TitledTextBlock
          title="4. Đổi/trả hàng"
          content="Sản phẩm chỉ được đổi/trả trong vòng 7 ngày nếu bị lỗi do nhà sản xuất hoặc hư hỏng trong quá trình vận chuyển. Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng."
        />
        <TitledTextBlock
          title="5. Chính sách từ thiện"
          content="Một phần doanh thu từ mỗi sản phẩm sẽ được trích để đóng góp vào các hoạt động thiện nguyện. Thông tin về các chương trình từ thiện sẽ được cập nhật minh bạch trên website hoặc fanpage chính thức."
        />
        <TitledTextBlock
          title="6. Quyền sở hữu trí tuệ"
          content="Tất cả nội dung (hình ảnh, nội dung, logo) thuộc quyền sở hữu của chúng tôi. Nghiêm cấm sao chép, sử dụng lại với mục đích thương mại nếu không được sự đồng ý bằng văn bản."
        />
        <TitledTextBlock
          title="7. Thay đổi điều khoản"
          content="Chúng tôi có quyền thay đổi các điều khoản mà không cần thông báo trước. Việc tiếp tục sử dụng website đồng nghĩa với việc bạn đồng ý với các cập nhật đó."
        />
        <TitledTextBlock
          title="8. Liên hệ"
          content={
            <>
              Mọi thắc mắc vui lòng liên hệ qua email:{" "}
              <Link
                href="mailto:info@artexhibition.com"
                className="text-[#1877F2] hover:underline"
              >
                info@artexhibition.com
              </Link>{" "}
              để được hỗ trợ.
            </>
          }
        />
      </div>
    </div>
  );
}
