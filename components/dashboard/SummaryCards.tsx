import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  PercentageOutlined,
  ReadOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {Card, Col, Row, Typography} from "antd";
import axios from "axios";
import React from "react";
import {useQuery} from "react-query";

const {Title, Text} = Typography;

interface DashboardSummary {
  totalRevenue: number;
  totalCustomers: number;
  newCustomersToday: number;
  totalPosts: number;
  totalOrders: number;
  successfulOrders: number;
  cancelledOrders: number;
  cancelRate: string;
}

// eslint-disable-next-line react/function-component-definition
const SummaryCards: React.FC = () => {
  const {data: summary, isLoading} = useQuery<DashboardSummary>(
    "dashboardSummary",
    async () => {
      const response = await axios.get("/api/dashboard/summary");
      return response.data;
    },
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(summary);

  const stats = [
    {
      title: "Tổng doanh thu",
      value: `${summary?.totalRevenue?.toLocaleString()}₫`,
      color: "#e8f5e9",
      icon: <DollarOutlined style={{fontSize: 28, color: "#43a047"}} />,
    },
    {
      title: "Tổng khách hàng",
      value: summary?.totalCustomers?.toString() || "0",
      color: "#ede7f6",
      icon: <TeamOutlined style={{fontSize: 28, color: "#5e35b1"}} />,
    },
    {
      title: "Khách hàng mới hôm nay",
      value: summary?.newCustomersToday?.toString() || "0",
      color: "#fce4ec",
      icon: <UserAddOutlined style={{fontSize: 28, color: "#d81b60"}} />,
    },
    {
      title: "Tổng số bài viết",
      value: summary?.totalPosts?.toString() || "0",
      color: "#e1f5fe",
      icon: <ReadOutlined style={{fontSize: 28, color: "#039be5"}} />,
    },
    {
      title: "Tổng đơn hàng",
      value: summary?.totalOrders?.toString() || "0",
      color: "#e3f2fd",
      icon: <ShoppingCartOutlined style={{fontSize: 28, color: "#1e88e5"}} />,
    },
    {
      title: "Đơn thành công",
      value: summary?.successfulOrders?.toString() || "0",
      color: "#e8f5e9",
      icon: <CheckCircleOutlined style={{fontSize: 28, color: "#2e7d32"}} />,
    },
    {
      title: "Đơn bị huỷ",
      value: summary?.cancelledOrders?.toString() || "0",
      color: "#ffebee",
      icon: <CloseCircleOutlined style={{fontSize: 28, color: "#c62828"}} />,
    },
    {
      title: "Tỉ lệ huỷ",
      value: `${summary?.cancelRate}%`,
      color: "#f3e5f5",
      icon: <PercentageOutlined style={{fontSize: 28, color: "#8e24aa"}} />,
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {stats.map((item, index) => (
        <Col xs={24} sm={12} md={8} lg={6} key={index}>
          <Card
            style={{
              backgroundColor: item.color,
              border: "none",
              borderRadius: 12,
            }}
            className="flex items-center"
            hoverable
          >
            <div style={{marginRight: 16}}>{item.icon}</div>
            <div>
              <Text type="secondary">{item.title}</Text>
              <Title level={4} style={{margin: 0}}>
                {item.value}
              </Title>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default SummaryCards;
