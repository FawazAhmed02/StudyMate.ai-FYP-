import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../config/api";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const Dashboard: React.FC = () => {
  const [pieChartData, setPieChartData] = useState<any>(null);
  const [barChartData, setBarChartData] = useState<any>(null);
  const [difficultyBarChartData, setDifficultyBarChartData] =
    useState<any>(null);
  const [lineChartData, setLineChartData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hardcoded user ID for testing
        const storedStudent = localStorage.getItem("student");
        const userId = storedStudent ? JSON.parse(storedStudent).name : "guest";
        const response = await fetch(
          `${API_ENDPOINTS.DASHBOARD_DATA}/${encodeURIComponent(userId)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text(); // Read the response as text
          console.error("Error fetching dashboard data:", errorText);
          setError("Failed to fetch dashboard data. Please try again later.");
          return;
        }

        const data = await response.json();
        setPieChartData(data.pieChartData);
        setBarChartData(data.barChartData);
        setDifficultyBarChartData(data.difficultyBarChartData);
        setLineChartData(data.lineChartData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Something went wrong. Please try again.");
      }
    };

    fetchData();
  }, []);

  if (error) return <div>{error}</div>;
  if (
    !pieChartData ||
    !barChartData ||
    !difficultyBarChartData ||
    !lineChartData
  )
    return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <div className="bg-[#E3F0FF] p-4 rounded-lg shadow h-80">
        <h2 className="text-xl font-bold text-[#22304A]">
          Correct vs Wrong Attempts
        </h2>
        <Pie data={pieChartData} />
      </div>
      <div className="bg-[#E3F0FF] p-4 rounded-lg shadow h-80">
        <h2 className="text-xl font-bold text-[#22304A]">
          Performance by Topic
        </h2>
        <Bar data={barChartData} />
      </div>
      <div className="bg-[#E3F0FF] p-4 rounded-lg shadow h-80">
        <h2 className="text-xl font-bold text-[#22304A]">
          Question Count by Difficulty
        </h2>
        <Bar data={difficultyBarChartData} />
      </div>
      <div className="bg-[#E3F0FF] p-4 rounded-lg shadow h-80">
        <h2 className="text-xl font-bold text-[#22304A]">Activity Over Time</h2>
        <Line data={lineChartData} />
      </div>
    </div>
  );
};

export default Dashboard;
