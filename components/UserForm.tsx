import {Button, Form, Input, message} from "antd";
import React, {useState} from "react";

interface UserFormProps {
  onSubmit?: (userData: any) => void;
  initialValues?: {
    id?: string;
    email?: string;
    name?: string;
    avatar?: string;
  };
  isEdit?: boolean;
}

// eslint-disable-next-line react/function-component-definition
const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  initialValues,
  isEdit = false,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const url = isEdit ? `/api/users/${initialValues?.id}` : "/api/users";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        message.success(`User ${isEdit ? "updated" : "created"} successfully!`);
        form.resetFields();
        onSubmit?.(data);
      } else {
        const error = await response.json();
        message.error(error.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
      style={{maxWidth: 600}}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {required: true, message: "Please input email!"},
          {type: "email", message: "Please enter a valid email!"},
        ]}
      >
        <Input placeholder="Enter email" />
      </Form.Item>

      <Form.Item
        label="Name"
        name="name"
        rules={[{required: true, message: "Please input name!"}]}
      >
        <Input placeholder="Enter name" />
      </Form.Item>

      <Form.Item label="Avatar URL" name="avatar">
        <Input placeholder="Enter avatar URL (optional)" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {isEdit ? "Update User" : "Create User"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
