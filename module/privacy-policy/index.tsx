import {PageHeader} from "@components/PageHeader";
import {TitledTextBlock} from "@components/TitledTextBlock";
import Link from "next/link";

export function PrivacyPolicy(): JSX.Element {
  return (
    <div className="w-full bg-white">
      <PageHeader
        title="Chính sách bảo mật"
        subtitle="Bảo vệ thông tin của bạn là cam kết hàng đầu của chúng tôi."
        backgroundImage="/img/privacy-policy.svg"
      />
      <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-[120px]">
        <TitledTextBlock
          title="1. Mục đích thu thập thông tin"
          content="Chúng tôi thu thập thông tin cá nhân như tên, email, địa chỉ và số điện thoại để phục vụ cho việc đặt hàng, giao hàng và hỗ trợ khách hàng. Ngoài ra, dữ liệu có thể được sử dụng để cải thiện trải nghiệm mua sắm và cung cấp các chương trình ưu đãi phù hợp."
        />
        <TitledTextBlock
          title="2. Phạm vi sử dụng thông tin"
          content="Thông tin của bạn sẽ chỉ được sử dụng nội bộ trong hệ thống quản lý của chúng tôi. Chúng tôi cam kết không chia sẻ, bán hoặc trao đổi dữ liệu cá nhân với bên thứ ba, trừ khi có yêu cầu từ cơ quan pháp luật hoặc được sự đồng ý của bạn."
        />
        <TitledTextBlock
          title="3. Bảo mật thông tin"
          content="Dữ liệu cá nhân được lưu trữ an toàn trên hệ thống của chúng tôi với các biện pháp bảo vệ nghiêm ngặt. Mọi giao dịch thanh toán đều được mã hóa để đảm bảo an toàn tuyệt đối."
        />
        <TitledTextBlock
          title="4. Quyền của khách hàng"
          content="Bạn có quyền yêu cầu truy cập, chỉnh sửa hoặc xoá thông tin cá nhân bất kỳ lúc nào. Mọi yêu cầu sẽ được chúng tôi phản hồi nhanh chóng và minh bạch."
        />
        <TitledTextBlock
          title="5. Liên hệ"
          content={
            <>
              Nếu bạn có bất kỳ câu hỏi nào liên quan đến chính sách bảo mật,
              vui lòng liên hệ với chúng tôi qua email:{" "}
              <Link
                href="mailto:info@artexhibition.com"
                className="text-[#1877F2] hover:underline"
              >
                info@artexhibition.com
              </Link>
            </>
          }
        />
      </div>
    </div>
  );
}
