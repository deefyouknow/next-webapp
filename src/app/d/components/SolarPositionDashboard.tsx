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

type DataType = "zenith" | "elevation" | "azimuth" | "lux_1" | "lux_2" | "lux_3" | "lux_4";

export default function SolarPositionDashboard() {
    const [solarData, setSolarData] = useState<any[]>([]);
    const [luxData, setLuxData] = useState<any[]>([]);
    const [granularity, setGranularity] = useState("hour");
    const [selectedType, setSelectedType] = useState<DataType>("zenith");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch Solar Position Data
    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/solar/position/chart?granularity=${granularity}`)
            .then((res) => {
                if (!res.ok) throw new Error(`Solar API Error: ${res.status}`);
                return res.json();
            })
            .then((json) => {
                if (Array.isArray(json)) {
                    setSolarData(json);
                } else {
                    setSolarData([]);
                    console.error("Invalid solar data format:", json);
                }
            })
            .catch((err) => {
                console.error("Solar Fetch error:", err);
                setError("Failed to load solar data.");
            })
            .finally(() => setLoading(false));
    }, [granularity]);

    // Fetch Lux Data (Auto-refresh)
    useEffect(() => {
        const fetchLux = () => {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/lux/chart/minute?limit=100`)
                .then((res) => {
                    if (!res.ok) throw new Error(`Lux API Error: ${res.status}`);
                    return res.json();
                })
                .then((json) => {
                    if (Array.isArray(json)) {
                        setLuxData(json);
                    } else {
                        setLuxData([]);
                        console.error("Invalid lux data format:", json);
                    }
                })
                .catch((err) => console.error("Lux Fetch error:", err));
        };

        fetchLux();
        const interval = setInterval(fetchLux, 10000);
        return () => clearInterval(interval);
    }, []);

    // Determine which dataset to use based on selected type
    const isLux = selectedType.startsWith("lux");
    const activeData = isLux ? luxData : solarData;

    // For Lux, we might need to reverse if API returns desc, but assuming API is consistent with SolarChart
    // SolarChart uses `lux/chart/minute` which returns chronological (oldest -> newest)

    const safeData = Array.isArray(activeData) ? activeData : [];
    const labels = safeData.map((d) => d.time ? (isLux ? d.time.split(' ')[1] : d.time) : '');

    const getLabel = (type: DataType) => {
        switch (type) {
            case "lux_1": return "Sensor 1 (Lux)";
            case "lux_2": return "Sensor 2 (Lux)";
            case "lux_3": return "Sensor 3 (Lux)";
            case "lux_4": return "Sensor 4 (Lux)";
            default: return type.charAt(0).toUpperCase() + type.slice(1);
        }
    };

    const getColor = (type: DataType) => {
        switch (type) {
            case "zenith": return "rgba(255, 99, 132, 1)";
            case "elevation": return "rgba(54, 162, 235, 1)";
            case "azimuth": return "rgba(75, 192, 192, 1)";
            case "lux_1": return "rgba(255, 99, 132, 1)";
            case "lux_2": return "rgba(54, 162, 235, 1)";
            case "lux_3": return "rgba(75, 192, 192, 1)";
            case "lux_4": return "rgba(255, 159, 64, 1)";
            default: return "rgba(0,0,0,1)";
        }
    };

    const chartData = {
        labels,
        datasets: [
            {
                label: getLabel(selectedType),
                data: safeData.map((d) => d[selectedType]),
                borderColor: getColor(selectedType),
                backgroundColor: getColor(selectedType).replace("1)", "0.2)"),
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
            title: { display: true, text: isLux ? "Real-time Lux Data" : "Solar Position Analysis" },
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
                title: { display: true, text: isLux ? "Lux Value" : "Degrees" },
            },
        },
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                {/* Solar Controls */}
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-500">Solar Position</h3>
                    <div className="space-x-2">
                        {(["zenith", "elevation", "azimuth"] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-3 py-1 text-sm rounded transition-colors ${selectedType === type
                                    ? "bg-gray-800 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lux Controls */}
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-500">Lux Sensors</h3>
                    <div className="space-x-2">
                        {(["lux_1", "lux_2", "lux_3", "lux_4"] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-3 py-1 text-sm rounded transition-colors ${selectedType === type
                                    ? "bg-blue-600 text-white"
                                    : "bg-blue-50 hover:bg-blue-100 text-blue-700"
                                    }`}
                            >
                                {getLabel(type).replace(" (Lux)", "")}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Granularity (Only for Solar) */}
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-500">Granularity</h3>
                    <select
                        value={granularity}
                        onChange={(e) => setGranularity(e.target.value)}
                        disabled={isLux}
                        className="px-4 py-1 border rounded text-sm disabled:opacity-50"
                    >
                        <option value="hour">Hourly</option>
                        <option value="day">Daily</option>
                    </select>
                </div>
            </div>

            {loading && !safeData.length && <div className="text-center py-10 text-gray-500">Loading data...</div>}

            {error && !isLux && (
                <div className="text-center py-10 text-red-500">
                    <p>{error}</p>
                </div>
            )}

            {!loading && (!error || isLux) && (
                <div style={{ height: "500px", width: "100%" }}>
                    <Line data={chartData} options={options} />
                </div>
            )}
        </div>
    );
}
