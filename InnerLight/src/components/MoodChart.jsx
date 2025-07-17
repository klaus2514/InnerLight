import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import axios from "axios";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

function MoodChart({ refresh }) {
  const [moodData, setMoodData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoodHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/moods/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMoodData(res.data);
      } catch (err) {
        console.error("Error fetching mood history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodHistory();
  }, [refresh]);

  const chartData = {
    labels: moodData.map((entry) =>
      new Date(entry.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    ),
    datasets: [
      {
        label: "Mood Level",
        data: moodData.map((entry) => entry.moodLevel),
        borderColor: "rgba(40, 167, 69, 1)",
        backgroundColor: "rgba(40, 167, 69, 0.2)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#28a745",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: (val) => {
            const emojis = ["😢", "😞", "😐", "🙂", "😊"];
            return emojis[Math.round(val) - 1] || val;
          },
        },
      },
    },
  };

  return (
    <div className="card shadow p-4 mb-4">
      <h5 className="mb-3 text-success">Mood History</h5>
      {loading ? (
        <p className="text-muted">Loading mood chart...</p>
      ) : moodData.length === 0 ? (
        <p className="text-muted">No mood data available yet.</p>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
}

export default MoodChart;
