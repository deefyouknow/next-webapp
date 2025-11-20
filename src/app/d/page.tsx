import LuxDashboardClient from './components/LuxDashboardClient'; // ตรวจสอบว่า path ไปยัง component ถูกต้อง
import { getLuxData } from './components/data'; // ตรวจสอบว่า path ไปยัง data function ถูกต้อง
import NavBar from '../../components/appbar/navbar';

export default async function Homee() {
  // 1. ดึงข้อมูลบน Server
  const { data, error } = await getLuxData();

  // 2. จัดการข้อผิดพลาดที่อาจเกิดขึ้นระหว่างการดึงข้อมูล
  if (error) {
    return (
      <main className="flex w-screen h-screen items-center justify-center p-4">
        <div className="p-8 text-center text-red-600 font-bold border border-red-300 bg-red-50 rounded-xl m-8">
          {error}
        </div>
      </main>
    );
  }

  // 3. หากสำเร็จ, render Client Component และส่ง data ที่ได้ไปเป็น prop
  return (
    <div>
      <NavBar />
      <LuxDashboardClient initialData={data} />
    </div>
  );
}
