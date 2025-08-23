import ProductPieChart from "@app/components/dashboard/ProductPieChart";
import RecentOrdersTable from "@app/components/dashboard/RecentOrdersTable";
import RevenueBarChart from "@app/components/dashboard/RevenueBarChart";
import SummaryCards from "@app/components/dashboard/SummaryCards";
import {Col, Row, Typography} from "antd";
import React from "react";

const {Title} = Typography;

// eslint-disable-next-line react/function-component-definition
const DashboardPage: React.FC = () => {
  return (
    <div style={{padding: 24}}>
      <Title level={3}>Bảng tổng quan</Title>

      {/* Tổng quan */}
      <SummaryCards />

      {/* Biểu đồ */}
      <Title level={4} style={{margin: "32px 0 16px"}}>
        Thống kê trực quan
      </Title>
      <Row gutter={16} style={{marginBottom: 24}}>
        <Col xs={24} md={12}>
          <ProductPieChart />
        </Col>
        <Col xs={24} md={12}>
          <RevenueBarChart />
        </Col>
      </Row>

      {/* Đơn hàng gần đây */}
      <RecentOrdersTable />
    </div>
  );
};

export default DashboardPage;
