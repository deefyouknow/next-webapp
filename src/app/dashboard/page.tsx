"use client";
// import SolarChart from './SolarChart';
import NavBar from '../../components/appbar/navbar';
import dynamic from "next/dynamic";

const LeaderboardChart = dynamic(() => import("./SolarChart"), { ssr: false })
export default function HomePage() {
  return (
    <div className='flex flex-col w-[100dvw] h-[100dvh] bg-gray-300'>
      {/*<NavBar />*/}
      <div className='w-[100dvw] flex justify-center'>        
        <h1 className='font-black text-3xl flex'>Solar Lux Chart</h1>
      </div>
      <LeaderboardChart />
    </div>
  );
}
