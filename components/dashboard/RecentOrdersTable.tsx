import {Card, Table, Tag} from "antd";
import axios from "axios";
import Link from "next/link";
import React from "react";
import {useQuery} from "react-query";

interface RecentOrder {
  key: string;
  customer: string;
  product: string;
  total: number;
  date: string;
  status: string;
}

const columns = [
  {title: "Khách hàng", dataIndex: "customer", key: "customer"},
  {title: "Sản phẩm", dataIndex: "product", key: "product"},
  {
    title: "Tổng tiền",
    dataIndex: "total",
    key: "total",
    render: (value: number) => `${value.toLocaleString()}₫`,
  },
  {
    title: "Ngày",
    dataIndex: "date",
    key: "date",
    render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: string) =>
      status === "delivered" ? (
        <Tag color="green">Hoàn tất</Tag>
      ) : status === "cancelled" ? (
        <Tag color="volcano">Đã huỷ</Tag>
      ) : status === "shipped" ? (
        <Tag color="blue">Đang giao</Tag>
      ) : status === "confirmed" ? (
        <Tag color="cyan">Đã xác nhận</Tag>
      ) : (
        <Tag color="default">Chờ xử lý</Tag>
      ),
  },
];

// eslint-disable-next-line react/function-component-definition
const RecentOrdersTable: React.FC = () => {
  const {data: recentOrders, isLoading} = useQuery<RecentOrder[]>(
    "recentOrders",
    async () => {
      const response = await axios.get("/api/dashboard/recent-orders");
      return response.data;
    },
  );

  return (
    <Card
      title="Đơn hàng gần đây"
      extra={
        <Link
          href="/order-admin"
          className="text-blue-600 hover:underline text-sm"
        >
          Xem thêm
        </Link>
      }
      hoverable
    >
      <Table
        columns={columns}
        dataSource={recentOrders}
        pagination={false}
        bordered
        loading={isLoading}
        rowClassName={(_, index) => (index % 2 === 0 ? "table-row-light" : "")}
      />
    </Card>
  );
};

export default RecentOrdersTable;
