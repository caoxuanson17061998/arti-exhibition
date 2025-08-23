import {PageHeader} from "@components/PageHeader";
import {TitledTextBlock} from "@components/TitledTextBlock";
import Link from "next/link";

export function ReturnPolicy(): JSX.Element {
  return (
    <div className="w-full bg-white">
      <PageHeader
        title="Chính sách đổi trả"
        subtitle="Art Exhibition cam kết mang đến trải nghiệm mua sắm an tâm và minh bạch cho khách hàng."
        backgroundImage="/img/return-policy.svg"
      />
      <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-[120px]">
        <TitledTextBlock
          title="1. Thời gian áp dụng đổi/trả"
          content="Bạn có thể yêu cầu đổi hoặc trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng."
        />
        <TitledTextBlock
          title="2. Điều kiện đổi/trả"
          content={
            <>
              <p className="!mb-2">
                Sản phẩm sẽ được chấp nhận đổi/trả nếu đáp ứng các điều kiện
                sau:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  Sản phẩm bị lỗi kỹ thuật do sản xuất (nứt, bể, không đúng mùi,
                  không cháy được…)
                </li>
                <li>Sản phẩm bị hư hỏng trong quá trình vận chuyển</li>
                <li>
                  Sản phẩm chưa qua sử dụng, còn nguyên vẹn và đầy đủ hộp, tem,
                  nhãn
                </li>
              </ul>
            </>
          }
        />
        <TitledTextBlock
          title="3. Trường hợp không áp dụng đổi/trả"
          content={
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Sản phẩm đã được sử dụng hoặc có dấu hiệu đã qua sử dụng</li>
              <li>
                Sản phẩm bị hư hỏng do lỗi từ phía khách hàng (rơi, vỡ, bảo quản
                sai cách)
              </li>
              <li>
                Sản phẩm nằm trong chương trình giảm giá thanh lý, xả kho (nếu
                có ghi rõ)
              </li>
            </ul>
          }
        />
        <TitledTextBlock
          title="4. Quy trình đổi/trả"
          content={
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                Liên hệ với chúng tôi qua email hoặc số điện thoại trong thời
                gian quy định.
              </li>
              <li>
                Gửi hình ảnh và thông tin chi tiết về sản phẩm lỗi hoặc lý do
                đổi/trả.
              </li>
              <li>
                Sau khi xác nhận, chúng tôi sẽ hướng dẫn bạn gửi lại sản phẩm và
                tiến hành đổi/trả hoặc hoàn tiền.
              </li>
            </ul>
          }
        />
        <TitledTextBlock
          title="5. Phí vận chuyển"
          content={
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                Miễn phí vận chuyển cho các trường hợp đổi trả do lỗi từ phía
                chúng tôi.
              </li>
              <li>
                Khách hàng chịu phí vận chuyển trong trường hợp đổi do nhu cầu
                cá nhân (nếu được chấp nhận).
              </li>
            </ul>
          }
        />
        <TitledTextBlock
          title="6. Thông tin liên hệ hỗ trợ"
          content={
            <>
              Email:{" "}
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
