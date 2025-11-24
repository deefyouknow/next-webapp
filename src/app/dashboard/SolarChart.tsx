"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin,
  annotationPlugin
);

export default function LuxChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    // User requested limit 100
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/lux/chart/minute?limit=100`)
      .then((res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (Array.isArray(json)) {
          setData(json);
          setError(null);
        } else {
          setData([]);
          setError("Invalid data format received.");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load data.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const safeData = Array.isArray(data) ? data : [];
  // Reverse data for chart if needed, but API usually returns desc. 
  // If API returns desc (newest first), we might want to reverse for chart (oldest left to newest right).
  // The API `lux/chart/minute` returns `reversed(results)` so it is chronological (oldest -> newest).

  const labels = safeData.map((d) => d.time ? d.time.split(' ')[1] : '');

  // Get latest values for display
  const latest = safeData.length > 0 ? safeData[safeData.length - 1] : null;

  // ✅ สร้าง background zone ตามช่วงเวลาแบบไม่มี label
  function getTimeZoneAnnotations(labels: string[]) {
    const zones: any = {};
    for (let i = 0; i < labels.length - 1; i++) {
      const label = labels[i];
      const nextLabel = labels[i + 1];
      if (!label || !nextLabel) continue;

      const hourMatch = label.match(/(\d{2}):(\d{2})/);
      if (!hourMatch) continue;
      const hour = parseInt(hourMatch[1]);

      let zoneColor = "";
      if (hour >= 6 && hour < 12) {
        zoneColor = "rgba(255, 223, 186, 0.2)";
      } else if (hour >= 12 && hour < 18) {
        zoneColor = "rgba(186, 255, 201, 0.2)";
      } else if (hour >= 18 && hour < 21) {
        zoneColor = "rgba(186, 225, 255, 0.2)";
      } else {
        zoneColor = "rgba(200, 200, 200, 0.2)";
      }

      zones[`zone-${i}`] = {
        type: "box",
        xMin: label,
        xMax: nextLabel,
        backgroundColor: zoneColor,
        drawTime: "beforeDatasetsDraw",
      };
    }
    return zones;
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: "Sensor 1",
        data: safeData.map((d) => d.lux_1),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Sensor 2",
        data: safeData.map((d) => d.lux_2),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Sensor 3",
        data: safeData.map((d) => d.lux_3),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Sensor 4",
        data: safeData.map((d) => d.lux_4),
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: `Lux Sensor Data (Live)` },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x",
        },
        pan: { enabled: true, mode: "x" },
      },
      annotation: {
        annotations: getTimeZoneAnnotations(labels),
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Time" },
        ticks: {
          maxTicksLimit: 20,
        },
      },
      y: {
        title: { display: true, text: "Lux Value" },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md space-y-4">
      {/* Latest Values Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
          <h3 className="text-sm font-semibold text-red-600">Sensor 1</h3>
          <p className="text-2xl font-bold text-gray-800">{latest ? Math.round(latest.lux_1) : "-"}</p>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-600">Sensor 2</h3>
          <p className="text-2xl font-bold text-gray-800">{latest ? Math.round(latest.lux_2) : "-"}</p>
        </div>
        <div className="p-4 bg-teal-50 border border-teal-100 rounded-lg">
          <h3 className="text-sm font-semibold text-teal-600">Sensor 3</h3>
          <p className="text-2xl font-bold text-gray-800">{latest ? Math.round(latest.lux_3) : "-"}</p>
        </div>
        <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
          <h3 className="text-sm font-semibold text-orange-600">Sensor 4</h3>
          <p className="text-2xl font-bold text-gray-800">{latest ? Math.round(latest.lux_4) : "-"}</p>
        </div>
      </div>

      {loading && !data.length && <div className="text-center py-10 text-gray-500">Loading data...</div>}

      {error && (
        <div className="text-center py-4 text-red-500 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div style={{ height: "500px", width: "100%" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
