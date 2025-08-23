import {PageHeader} from "@components/PageHeader";
import {Col, Row, Typography} from "antd";
import Image from "next/image";

export function Charity(): JSX.Element {
  return (
    <div className="w-full bg-white">
      <PageHeader
        title="Hãy để chúng tôi giúp bạn gây quỹ"
        subtitle="Với tranh nghệ thuật vì cộng đồng"
        backgroundImage="/img/charity.svg"
      />

      <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-[120px] space-y-12">
        <Row
          gutter={{
            xs: 16,
            md: 32,
          }}
          align="top"
        >
          <Col xs={24} md={4}>
            <Typography className="text-[#212B36] mb-1 text-base">
              Triết lý
            </Typography>
            <Typography className="text-[#212B36] mb-1 text-base">
              của chúng tôi
            </Typography>
          </Col>
          <Col xs={24} md={20}>
            <Typography className="text-[#212B36] mb-3 font-bold md:text-[32px] text-2xl">
              Tranh nghệ thuật vì cộng đồng
            </Typography>
            <Typography className="text-[#212B36] mb-3 font-bold md:text-[32px] text-2xl">
              Nâng tầm không gian, tỏa yêu thương
            </Typography>
          </Col>
        </Row>

        <Row
          gutter={{
            xs: 16,
            md: 32,
          }}
          align="middle"
        >
          <Col xs={24} md={12}>
            <div className="rounded-3xl overflow-hidden relative w-full aspect-square">
              <Image
                src="/img/charity/candle-left.svg"
                alt="Candle Left"
                fill
                className="object-cover rounded-3xl"
              />
            </div>
            <Typography className="mt-6 text-[#212B36] text-base text-center md:text-left">
              Chúng tôi cam kết sử dụng các vật liệu chất lượng cao, bền vững và
              an toàn cho môi trường. Từ chất liệu canvas cao cấp, mực in bền
              màu đến khung tranh thân thiện với môi trường (ví dụ: gỗ được
              chứng nhận FSC nếu áp dụng cho khung tranh gỗ), mỗi chi tiết đều
              được lựa chọn kỹ lưỡng để đảm bảo giá trị nghệ thuật và độ bền
              vượt thời gian. Từng tác phẩm là sự kết hợp hài hòa giữa tài năng
              nghệ sĩ và trách nhiệm với xã hội, mang đến vẻ đẹp ấm áp và nguồn
              cảm hứng bất tận cho không gian của bạn.
            </Typography>
          </Col>
          <Col xs={24} md={12}>
            <Typography className="mb-6 mt-0 md:mt-6 text-[#212B36] text-base text-center md:text-left">
              Chúng tôi tự hào mang đến những tác phẩm tranh 2D cao cấp, không
              chỉ là biểu tượng của vẻ đẹp tinh tế mà còn là cầu nối lan tỏa giá
              trị nhân ái đến cộng đồng. Mỗi bức tranh được tạo ra không chỉ để
              làm đẹp không gian sống của bạn mà còn chứa đựng ý nghĩa bền vững
              và lòng trắc ẩn.
            </Typography>
            <div className="rounded-3xl overflow-hidden relative w-full aspect-square">
              <Image
                src="/img/charity/candle-right.svg"
                alt="Candle Left"
                fill
                className="object-cover rounded-3xl"
              />
            </div>
          </Col>
        </Row>

        <div className="text-center max-w-4xl mx-auto space-y-4">
          <Typography className="text-[#212B36] font-bold text-2xl md:text-[32px]">
            Chúng ta hãy bắt đầu nhé!
          </Typography>
          <Typography className="text-[#212B36] text-base">
            Tôi rất vui khi cung cấp mức giá đặc biệt cho những cây nến mang
            nhãn hiệu riêng của bạn để bạn và nhóm của bạn có thể bán lại chúng
            với mức giá giúp bạn đạt được mục tiêu gây quỹ (đồng thời giúp các
            nhà tài trợ luôn ghi nhớ sáng kiến của bạn khi ngọn nến của bạn cháy
            từ từ trên bệ bếp hoặc lò sưởi của họ trong nhiều tháng).
            <br />
            Chúng tôi sử dụng những thành phần tốt nhất và bền vững nhất, hương
            thơm không chứa paraben và pthalate, bấc gỗ được chứng nhận FSC (có
            tiếng nổ lách tách) và không giới hạn với nhãn nến. Số lượng tối
            thiểu thấp, giá cả cạnh tranh, dịch vụ tuyệt vời và một sản phẩm mà
            bạn sẽ tự hào khi ghi tên mình.
            <br />
            Hãy điền vào mẫu dưới đây, chúng tôi sẽ phản hồi bạn trong vòng 48
            giờ hoặc ít hơn, và chúng ta có thể bắt đầu ngay!
            <br />
            Những thứ cần bao gồm:
            <br />
            Tên và trang web của tổ chức từ thiện | Số lượng bắt đầu | Ngày cần
            thiết | Bất kỳ ý tưởng thú vị nào
          </Typography>
        </div>
      </div>
    </div>
  );
}
