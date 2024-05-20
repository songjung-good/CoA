import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import useRepoDetailStore from "@/store/repodetail";

// Register the necessary components
ChartJS.register(
  RadialLinearScale,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend,
);

export default function RepoScore() {
  const codeScore = useRepoDetailStore.getState().result.commitScoreDto;

  const chartData = {
    labels: ["가독성", "성능", "재활용성", "테스트 용이성", "예외 처리"],
    datasets: [
      {
        label: "분석 점수",
        data: [
          codeScore.readability,
          codeScore.performance,
          codeScore.reusability,
          codeScore.testability,
          codeScore.exception,
        ],

        backgroundColor: "rgba(255, 108, 61, 0.2)",
        borderColor: "rgba(255, 108, 61, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(255, 108, 61, 1)",
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: false,
        },
        ticks: {
          display: false, // Make sure to display ticks
          stepSize: 20, // Tick interval set to every 20 units
        },
        suggestedMin: 0,
        suggestedMax: 100,
        pointLabels: {
          font: {
            size: 14, // Increase label font size
            weight: "bold" as const, // Make label font bold
          },
          color: "#000", // Optional: change the color of the labels
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 0,
          font: {
            size: 16,
            weight: "bold" as const,
          },
          color: "#fe764a",
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
      },
      point: {
        radius: 2,
        hoverBorderwidth: 4,
      },
    },
  };

  return (
    <div className=" min-w-40 min-h-40">
      <Radar data={chartData} options={chartOptions} />
    </div>
  );
}
