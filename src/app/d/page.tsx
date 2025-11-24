"use client";
import dynamic from 'next/dynamic';
import NavBar from '../../components/appbar/navbar';

const SolarPositionDashboard = dynamic(() => import('./components/SolarPositionDashboard'), { ssr: false });

export default function Homee() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Solar Position Analysis</h1>
        <SolarPositionDashboard />
      </div>
    </div>
  );
}
