import { ProjectSummaryItemGet } from "@/shared/types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import styles from "./MainChart.module.css";

interface MainChartProps {
  data: ProjectSummaryItemGet[];
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MainChart = ({ data = [] }: MainChartProps) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  const chartData = {
    labels: data.map(item => item.projectName),
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
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: '#FFFFFF',
          font: {
            size: 14,
          },
          boxWidth: 20,
          padding: 15,
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#FFFFFF',
          font: {
            size: 12,
          }
        },
        grid: {
          color: 'rgba(255,255,255,0.1)',
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#FFFFFF',
          font: {
            size: 12,
          }
        },
        grid: {
          color: 'rgba(255,255,255,0.1)',
        }
      }
    }
  };

  return (
    <div className={styles.mainChartBox} style={{ backgroundColor: '#242424', height: 400, padding: 20 }}>
      <Bar key={data.length} data={chartData} options={options} />
    </div>
  );
};

export default MainChart;
