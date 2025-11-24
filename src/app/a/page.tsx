"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import NavBar from '../../components/appbar/navbar';

// โหลด Leaflet แบบ client-side เท่านั้น
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
});

import SolarResult from './components/SolarResult';

export default function PageA() {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [elev, setElev] = useState<number | null>(null);
  const [solarData, setSolarData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // function sentDate (Save to DB)
  const sendData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generateresult/nexttodb`, {
      method: "POST", // ✅ ใช้ POST เพื่อสร้างข้อมูลใหม่
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "latitude": pos?.lat ?? 0,
        "longitude": pos?.lng ?? 0,
        "elevation": elev ?? 0,
        "degree_angle_one": parseInt((document.getElementById("north") as HTMLInputElement).value) || 0,
        "degree_angle_two": parseInt((document.getElementById("east") as HTMLInputElement).value) || 90,
        "degree_angle_three": parseInt((document.getElementById("south") as HTMLInputElement).value) || 180,
        "degree_angle_four": parseInt((document.getElementById("west") as HTMLInputElement).value) || 270
      }),
    });
    const data = await res.json(); // แปลงผลลัพธ์จาก JSON → object
    console.log("POST:", data);
  };

  // function calculateSolar (Get Real-time Data)
  const calculateSolarPosition = async () => {
    if (!pos) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generateresult/returnresult`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "latitude": pos.lat,
          "longitude": pos.lng,
          "elevation": elev ?? 0
        }),
      });
      const data = await res.json();
      setSolarData(data);
    } catch (error) {
      console.error("Error calculating solar position:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex justify-center items-center w-full py-8">
        <div className="w-full max-w-7xl flex flex-col p-8 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Leaflet Next.js + GPS + Elevation</h2>

          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <MapView pos={pos} setPos={setPos} elev={elev} setElev={setElev} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-semibold w-24">Latitude:</span>
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{pos?.lat?.toFixed(6) ?? "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold w-24">Longitude:</span>
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{pos?.lng?.toFixed(6) ?? "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold w-24">Elevation:</span>
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{elev ?? "-"} m</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="north">
                  North (0):
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    id="north"
                    placeholder="0"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue="0"
                    pattern="[0-9]*" // Allow only numbers
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                  <span className="ml-2">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="east">
                  East (90):
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    id="east"
                    placeholder="90"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue="90"
                    pattern="[0-9]*" // Allow only numbers
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                  <span className="ml-2">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"></path></svg>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="south">
                  South (180):
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    id="south"
                    placeholder="180"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue="180"
                    pattern="[0-9]*" // Allow only numbers
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                  <span className="ml-2">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5l-9 2 9 18 9-18-9 2zm0 0v8"></path></svg>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="west">
                  West (270):
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    id="west"
                    placeholder="270"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue="270"
                    pattern="[0-9]*" // Allow only numbers
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                  <span className="ml-2">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m7 7-7-7 7-7"></path></svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all active:scale-95"
                onClick={sendData}
              >
                Save Location
              </button>

              <button
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-lg shadow-amber-500/30 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={calculateSolarPosition}
                disabled={!pos || loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Calculate Solar Position
                  </>
                )}
              </button>
            </div>
          </div>

          <SolarResult data={solarData} />
        </div>
      </div>
    </div>
  );
}
