import { CategorySummaryItemGet, TaskSummaryItemGet } from "@/shared/types";
import { Doughnut } from "react-chartjs-2";
import styles from "./SecondaryChart.module.css";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SecondaryChartProps {
  data: CategorySummaryItemGet[] | TaskSummaryItemGet[];
  chartKey: string;
}

const isCategoryData = (
  data: CategorySummaryItemGet[] | TaskSummaryItemGet[]
): data is CategorySummaryItemGet[] => {
  return data.length > 0 && "categoryName" in data[0];
};

const SecondaryChart = ({ data, chartKey }: SecondaryChartProps) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  const labels = isCategoryData(data)
    ? data.map(item => item.categoryName)
    : data.map(item => item.taskName);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total hours",
        data: data.map(item => Math.round((item.totalMinutes / 60) * 100) / 100),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
          "#9966FF", "#FF9F40", "#FFCD56", "#C9CBCF", "#8BC34A"
        ]
      }
    ]
  };

const options = {
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: '#FFFFFF',
        boxWidth: 10,
        boxHeight: 10,
        padding: 8,
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      enabled: true,
    },
  },
  maintainAspectRatio: false,
};

  return (
    <div className={styles.mainChartBox}>
      <Doughnut
        key={chartKey}
        data={chartData}
        options={options}
      />
    </div>
  );
};

export default SecondaryChart;
