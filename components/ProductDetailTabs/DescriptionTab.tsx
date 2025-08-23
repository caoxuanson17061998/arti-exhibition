import {Col, Row, Typography} from "antd";

const {Paragraph} = Typography;

interface DescriptionTabProps {
  productInfo: {label: string; value: string}[];
  description: string;
}

export default function DescriptionTab({
  productInfo,
  description,
}: DescriptionTabProps) {
  return (
    <div className="pt-6">
      <Typography className="text-[#212B36] text-lg font-semibold">
        Thông tin sản phẩm
      </Typography>

      <div className="mt-4 space-y-3">
        {productInfo.map((item, index) => (
          <Row gutter={[16, 8]} key={index}>
            <Col xs={24} sm={6} md={5}>
              <Typography className="text-[#212B36] text-sm">
                {item.label}
              </Typography>
            </Col>
            <Col xs={24} sm={18} md={19}>
              <Typography className="text-[#212B36] text-sm">
                {item.value}
              </Typography>
            </Col>
          </Row>
        ))}
      </div>

      <Paragraph className="mt-10 text-[#212B36] text-sm">
        {description}
      </Paragraph>
    </div>
  );
}
