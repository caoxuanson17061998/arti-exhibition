import "./styles.css";
import IconOrderDashboard from "@components/Icon/IconOrderDashboard";
import IconProductDashboard from "@components/Icon/IconProductDashboard";
import IconLesson from "@components/Icon/home/IconLesson";
import IconUser from "@components/Icon/home/IconUser";
import {useListUserData} from "@module/admin/user/useUserQueries";
import {Box, Typography} from "@mui/material";
import axios from "axios";
import React from "react";
import {useQuery} from "react-query";

export function Dashboard(): JSX.Element {
  const {data: postsData} = useQuery(
    ["posts"],
    async () => {
      const response = await axios.get(`/api/posts`);
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  const {data: productsData} = useQuery(["products"], async () => {
    const res = await axios.get("/api/products");
    return res.data;
  });

  const {data: ordersData} = useQuery(
    ["orders"],
    async () => {
      const res = await axios.get("/api/orders");
      return res.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  const {data: dataListUser} = useListUserData();

  // Mock data for stats
  const stats = [
    {
      title: "Tổng bài viết",
      value: postsData?.length || 0,
      icon: <IconLesson />,
      color: "bg-[#C8E6C9]",
    },
    {
      title: "Tổng sản phẩm",
      value: productsData?.length || 0,
      icon: <IconOrderDashboard />,
      color: "bg-pink-100",
    },
    {
      title: "Tổng khách hàng",
      value: dataListUser?.users?.length,
      icon: <IconUser />,
      color: "bg-purple-100",
    },
  ];

  return (
    <Box className="w-full p-5 bg-white">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="col-span-1">
            <div className={`stats-card ${stat.color}`}>
              <Box className="flex justify-between">
                <Box>
                  <Typography className="text-sm font-semibold text-gray-700 mb-1">
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" className="font-semibold">
                    {stat.value}
                  </Typography>
                </Box>
                <Box className="text-gray-700">{stat.icon}</Box>
              </Box>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <div className="stats-card bg-[#CBFBF6] w-[32%]">
          <Box className="flex justify-between">
            <Box>
              <Typography className="text-sm font-semibold text-gray-700 mb-1">
                Tổng đơn hàng
              </Typography>
              <Typography variant="h4" className="font-semibold">
                {ordersData?.pagination?.total || 0}
              </Typography>
            </Box>
            <Box className="text-gray-700">
              <IconProductDashboard />
            </Box>
          </Box>
        </div>
      </div>
    </Box>
  );
}
