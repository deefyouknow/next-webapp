"use client";
import dynamic from 'next/dynamic';
import NavBar from '../../components/appbar/navbar';

const SolarPositionDashboard = dynamic(() => import('./components/SolarPositionDashboard'), { ssr: false });
const LuxOverview = dynamic(() => import('../dashboard/SolarChart'), { ssr: false });

export default function Homee() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto p-6 space-y-8">

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Solar Analytics Dashboard</h1>
          <p className="text-gray-500 mt-2">Comprehensive view of sensor data and solar positioning</p>
        </header>

        {/* Section 1: Lux Overview (Original API) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
              Lux Sensor Overview
            </h2>
            <span className="text-sm text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm border">
              Live Data & Zones
            </span>
          </div>
          <LuxOverview />
        </section>

        {/* Section 2: Solar Position & Overlay */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
              Solar Position Analysis
            </h2>
            <span className="text-sm text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm border">
              Dual-Axis Comparison
            </span>
          </div>
          <SolarPositionDashboard />
        </section>

      </div>
    </div>
  );
}
