import GlobalButton from "@app/components/GlobalButton";
import {PageHeader} from "@components/PageHeader";
import {Button, Form, Input, Typography, message} from "antd";
import {FiSend} from "react-icons/fi";

export function Contact(): JSX.Element {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form values:", values);
    message.success("Gửi tin nhắn thành công!");
    form.resetFields(); // Nếu muốn reset form sau khi gửi
  };

  return (
    <div className="w-full bg-white">
      <PageHeader
        title="Liên hệ"
        subtitle="Kết nối với thế giới nghệ thuật"
        backgroundImage="/img/contact.svg"
      />
      <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-[120px]">
        <div className="text-center max-w-[1000px] mx-auto mb-10">
          <Typography className="text-xl font-semibold text-[#212B36] ">
            Chúng tôi rất vui được lắng nghe bạn!
          </Typography>
          <Typography className="mt-1 text-xl font-semibold text-[#212B36] ">
            Nếu bạn có bất kỳ câu hỏi, góp ý hay yêu cầu đặt hàng đặc biệt nào,
            đừng ngần ngại liên hệ với Art Exhibition. Đội ngũ của chúng tôi
            luôn sẵn sàng hỗ trợ bạn một cách nhanh chóng và tận tâm.
          </Typography>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-10">
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Form.Item
                name="name"
                rules={[{required: true, message: "Vui lòng nhập họ tên"}]}
              >
                <Input
                  size="large"
                  placeholder="Họ tên"
                  className="h-[54px] rounded-[10px] px-3.5 py-4"
                />
              </Form.Item>
              <Form.Item
                name="phone"
                rules={[
                  {required: true, message: "Vui lòng nhập số điện thoại"},
                ]}
              >
                <Input
                  size="large"
                  placeholder="Điện thoại"
                  className="h-[54px] rounded-[10px] px-3.5 py-4"
                />
              </Form.Item>
            </div>
            <Form.Item
              name="email"
              rules={[{type: "email", message: "Email không hợp lệ"}]}
            >
              <Input
                size="large"
                placeholder="Email"
                className="h-[54px] rounded-[10px] px-3.5 py-4"
              />
            </Form.Item>
            <Form.Item name="message">
              <Input.TextArea
                rows={4}
                placeholder="Viết gì đó..."
                className="!min-h-[104px]"
              />
            </Form.Item>
            <Form.Item className="flex justify-center">
              <GlobalButton className="primary rounded-2xl h-12 px-[22px] py-[11px] text-[#161C24] flex items-center gap-2">
                Gửi tin nhắn
                <FiSend size={24} />
              </GlobalButton>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
