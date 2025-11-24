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
    zoomPlugin
);

export default function SolarPositionDashboard() {
    const [data, setData] = useState<any[]>([]);
    const [granularity, setGranularity] = useState("hour");
    const [selectedType, setSelectedType] = useState<"zenith" | "elevation" | "azimuth">("zenith");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/solar/position/chart?granularity=${granularity}`)
            .then((res) => {
                if (!res.ok) throw new Error(`API Error: ${res.status}`);
                return res.json();
            })
            .then((json) => {
                if (Array.isArray(json)) {
                    setData(json);
                } else {
                    console.error("Invalid data format:", json);
                    setData([]);
                    setError("Invalid data received from server.");
                }
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setError("Failed to load data. Please check API connection.");
            })
            .finally(() => setLoading(false));
    }, [granularity]);

    const safeData = Array.isArray(data) ? data : [];
    const labels = safeData.map((d) => d.time);

    const chartData = {
        labels,
        datasets: [
            {
                label: selectedType.charAt(0).toUpperCase() + selectedType.slice(1),
                data: safeData.map((d) => d[selectedType]),
                borderColor:
                    selectedType === "zenith" ? "rgba(255, 99, 132, 1)" :
                        selectedType === "elevation" ? "rgba(54, 162, 235, 1)" :
                            "rgba(75, 192, 192, 1)",
                backgroundColor:
                    selectedType === "zenith" ? "rgba(255, 99, 132, 0.2)" :
                        selectedType === "elevation" ? "rgba(54, 162, 235, 0.2)" :
                            "rgba(75, 192, 192, 0.2)",
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
            title: { display: true, text: `Solar Position (${selectedType})` },
            zoom: {
                zoom: {
                    wheel: { enabled: true },
                    pinch: { enabled: true },
                    mode: "x",
                },
                pan: { enabled: true, mode: "x" },
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
                title: { display: true, text: "Degrees" },
            },
        },
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <div className="flex justify-between mb-4">
                <div className="space-x-2">
                    <button
                        onClick={() => setSelectedType("zenith")}
                        className={`px-4 py-2 rounded ${selectedType === "zenith" ? "bg-red-500 text-white" : "bg-gray-200"}`}
                    >
                        Zenith
                    </button>
                    <button
                        onClick={() => setSelectedType("elevation")}
                        className={`px-4 py-2 rounded ${selectedType === "elevation" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        Elevation
                    </button>
                    <button
                        onClick={() => setSelectedType("azimuth")}
                        className={`px-4 py-2 rounded ${selectedType === "azimuth" ? "bg-teal-500 text-white" : "bg-gray-200"}`}
                    >
                        Azimuth
                    </button>
                </div>

                <select
                    value={granularity}
                    onChange={(e) => setGranularity(e.target.value)}
                    className="px-4 py-2 border rounded"
                >
                    <option value="hour">Hourly</option>
                    <option value="day">Daily</option>
                </select>
            </div>

            {loading && <div className="text-center py-10 text-gray-500">Loading data...</div>}

            {error && (
                <div className="text-center py-10 text-red-500">
                    <p>{error}</p>
                    <p className="text-sm text-gray-400 mt-2">If API is 404, please restart Docker container.</p>
                </div>
            )}

            {!loading && !error && (
                <div style={{ height: "500px", width: "100%" }}>
                    <Line data={chartData} options={options} />
                </div>
            )}
        </div>
    );
}
