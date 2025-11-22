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
  zoomPlugin,
  annotationPlugin
);

export default function LuxChart() {
  const [granularity, setGranularity] = useState("Hour");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/minmax`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Type: granularity }),
    })
      .then((res) => res.json())
      .then((json) => setData(json));
  }, [granularity]);

  const limitedData = data.slice(-100);
  const labels = limitedData.map((d) => d.Day || d.Hour || d.Minute);

  // ✅ สร้าง background zone ตามช่วงเวลาแบบไม่มี label
  function getTimeZoneAnnotations(labels: string[]) {
    const zones: any = {};
    for (let i = 0; i < labels.length - 1; i++) {
      const label = labels[i];
      const nextLabel = labels[i + 1];
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
        drawTime: "beforeDatasetsDraw", // ✅ อยู่หลังเส้น
      };
    }
    return zones;
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: "Lux1 Max",
        data: limitedData.map((d) => d.MaxLux1),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
        hidden: granularity === "Day",
        // Add this to make the legend highlight work
        // See: https://www.chartjs.org/docs/latest/configuration/interactions.html#interaction-configuration
        // and: https://www.chartjs.org/docs/latest/configuration/legend.html#legend-item-style
        // And: https://www.chartjs.org/docs/latest/developers/plugins.html
      },
      {
        label: "Lux2 Max",
        data: limitedData.map((d) => d.MaxLux2),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Lux3 Max",
        data: limitedData.map((d) => d.MaxLux3),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Lux4 Max",
        data: limitedData.map((d) => d.MaxLux4),
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
    borderColor: "rgba(0, 0, 0, 0.1)",
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: `Lux Angles (${granularity})` },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x",
          // Zoom in a bit on initial load
        },
        pan: { enabled: true, mode: "x" },
        limits: {
          x: { min: "original", max: "original" },
        },
      },
      annotation: {
        annotations: getTimeZoneAnnotations(labels),
      },
      tooltip: {
        titleColor: "#c0c6dc",
        bodyColor: "#c0c6dc",
        backgroundColor: "#252b48",
        borderColor: "#3c4766",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        title: { display: true, text: granularity },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20,
          color: "#c0c6dc", // TradingView-like text color
        },
        grid: {
          color: "rgba(50, 57, 78, 0.5)", // TradingView-like grid color
          display: true,
        },
      },
      y: {
        title: { display: true, text: "Lux Value", color: "#c0c6dc" },
        beginAtZero: true,
        ticks: {
          color: "#c0c6dc", // TradingView-like text color
        },
        grid: {
          color: "rgba(50, 57, 78, 0.5)", // TradingView-like grid color
        },
      },
    },
    // Add a TradingView-inspired theme.  Consider a separate CSS file for more complex styling.
    elements: {
      line: {
        tension: 0.4, // Adjust the curve of the lines
      },
      point: {
        radius: 0, // Hide points
      },
    },
    // Styling for a dark theme (TradingView-esque)

    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 0,
        bottom: 0,
      },
    },
  };

  const chartStyle = {
    backgroundColor: "#131722",
    color: "#c0c6dc",
    padding: "1rem",
    borderRadius: "0.5rem",
  };


  return (
    <div style={chartStyle}>
      {/* Dropdown เลือก Granularity */}
      <select
        value={granularity}
        onChange={(e) => setGranularity(e.target.value)}
        style={{
          marginBottom: "1rem",
          padding: "0.5rem",
          backgroundColor: "#252b48",
          color: "#c0c6dc",
          border: "1px solid #3c4766",
          borderRadius: "0.25rem",
        }}
      >
        <option value="Day">Day</option>
        <option value="Hour">Hour</option>
        <option value="Min">Min</option>
      </select>

      {/* Chart */}
      <div style={{ height: "500px", width: "100%" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
