import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import {Bar} from "react-chartjs-2";
import {useQuery} from "react-query";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface RevenueData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderRadius: number;
  }[];
}

function RevenueBarChart() {
  const {data: revenueData, isLoading} = useQuery<RevenueData>(
    "revenueByMonth",
    async () => {
      const response = await axios.get("/api/dashboard/revenue-by-month");
      return response.data;
    },
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {display: false},
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.raw.toLocaleString()}₫`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 h-[540px] flex flex-col">
      <h3 className="text-base font-semibold mb-2">Doanh thu theo tháng</h3>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full relative h-full">
          <Bar
            data={revenueData || {labels: [], datasets: []}}
            options={options}
          />
        </div>
      </div>
    </div>
  );
}

export default RevenueBarChart;
