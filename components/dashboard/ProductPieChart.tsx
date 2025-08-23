import axios from "axios";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";
import React from "react";
import {Pie} from "react-chartjs-2";
import {useQuery} from "react-query";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryStat {
  name: string;
  count: number;
}

const COLORS = ["#FFCDD2", "#C8E6C9", "#BBDEFB", "#D1C4E9"];

function ProductPieChart() {
  const {data: categoryStats, isLoading} = useQuery<CategoryStat[]>(
    "productsByCategory",
    async () => {
      const response = await axios.get("/api/dashboard/products-by-category");
      return response.data;
    },
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const data = {
    labels: categoryStats?.map((cat) => cat.name) || [],
    datasets: [
      {
        label: "Số lượng",
        data: categoryStats?.map((cat) => cat.count) || [],
        backgroundColor: COLORS,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
    cutout: "60%",
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 h-[540px] flex flex-col">
      <h3 className="text-base font-semibold mb-2">Phân loại sản phẩm</h3>
      <div className="flex-1 flex items-center justify-center">
        <div className="h-full max-w-full aspect-[1/1] relative">
          <Pie data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default ProductPieChart;
