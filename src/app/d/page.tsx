import LuxDashboardClient from './components/LuxDashboardClient'; // ตรวจสอบว่า path ไปยัง component ถูกต้อง
import { getLuxData } from '../../components/data'; // ตรวจสอบว่า path ไปยัง data function ถูกต้อง
import NavBar from '../../components/appbar/navbar';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

export default async function Homee() {
  // 1. ดึงข้อมูลบน Server
  const { data, error } = await getLuxData(0, 100);

  return (
    <div>
      <NavBar />
      {error ? (
        <main className="flex w-full h-[calc(100vh-64px)] items-center justify-center p-4">
          <div className="p-8 text-center text-red-600 font-bold border border-red-300 bg-red-50 rounded-xl m-8">
            {error}
          </div>
        </main>
      ) : (
        <LuxDashboardClient initialData={data} />
      )}
    </div>
  );
}
