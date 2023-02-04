import "./CityStorage.scss";
import { Line } from "react-chartjs-2";
import StorageItem from "./components/StorageItem";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CityStorageProps {
  storage:
    | {
        id: number;
        priceStats: number[];
        maxStep: number;
        minPrice: number;
        maxPrice: number;
      }[]
    | [];
  onBuy: (goodId: number, qty: number, price: number) => void;
}

function CityStorage({ storage, onBuy }: CityStorageProps) {
  const options = {
    tension: 0.4,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        intersect: false,
        caretSize: 3,

        backgroundColor: "#8d6048",
        bodyColor: "#d6ba7a",
        borderColor: "#8d6048",
        borderWidth: 1,
        displayColors: false,

        callbacks: {
          title() {
            return "";
          },
        },
      },
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          beginAtZero: false,
          fontColor: "#d6ba7a",
          fontSize: 10,
        },
        gridLines: {
          display: false,
        },
      },
      x: {
        display: false,
      },
    },
  };

  const getGoodData = (priceStats: number[]) => {
    return {
      labels: ["1", "2", "3", "4", "5", "6", "7", "8"],
      datasets: [
        {
          label: "Price for psc",
          data: priceStats,
          fill: false,
          backgroundColor: "#8d6048",
          borderColor: "#8d604844",
        },
      ],
    };
  };

  return (
    <div>
      <h2 className="title">City storage</h2>

      <div className="panel">
        <div className="city-goods">
          {storage.map((good) => (
            <div className="good-item-wrapper" key={good.id}>
              <StorageItem good={good} onBuy={onBuy} />
              <div className="good-item-stats">
                <Line data={getGoodData(good.priceStats)} options={options} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CityStorage;
