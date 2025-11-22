"use client";

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProcessedLuxData } from '../../../components/data'; // นำเข้า type จากไฟล์ data ของคุณ
interface LuxDashboardClientProps {
  initialData: ProcessedLuxData[];
}

export default function LuxDashboardClient({ initialData }: LuxDashboardClientProps) {
  // ข้อมูลถูกส่งมาผ่าน props จาก Server Component
  const [luxData, setLuxData] = useState<ProcessedLuxData[]>(initialData);
  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const [loadedCount, setLoadedCount] = useState(initialData.length);

  useEffect(() => {
    let isMounted = true;
    const fetchMoreData = async () => {
      let skip = initialData.length;
      const limit = 500; // Fetch in larger chunks

      while (isMounted) {
        try {
          // Fetch next chunk
          const res = await fetch(`${process.env.NEXT_PUBLIC_DATA_API_URL}/all/lux_values?skip=${skip}&limit=${limit}`);
          if (!res.ok) break;

          const newRawData = await res.json();
          if (!Array.isArray(newRawData) || newRawData.length === 0) {
            setIsLoadingMore(false);
            break;
          }

          const newProcessedData = newRawData.map((item: any) => ({
            id: item.id,
            lux: item.lux_value,
            time: new Date(item.data_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
            fullTime: item.data_time
          }));

          if (isMounted) {
            setLuxData(prev => {
              // Filter out duplicates based on ID just in case
              const existingIds = new Set(prev.map(p => p.id));
              const uniqueNewData = newProcessedData.filter((p: any) => !existingIds.has(p.id));
              return [...prev, ...uniqueNewData];
            });
            setLoadedCount(prev => prev + newProcessedData.length);
            skip += limit;

            // Add a small delay to allow UI to render and not freeze
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } catch (error) {
          console.error("Error fetching more data:", error);
          break;
        }
      }
      if (isMounted) setIsLoadingMore(false);
    };

    fetchMoreData();

    return () => {
      isMounted = false;
    };
  }, [initialData]);

  // คำนวณค่า Lux ปัจจุบันและค่าเฉลี่ย
  const latestLux = luxData.length > 0 ? luxData[luxData.length - 1].lux : 'ไม่มีข้อมูล';
  const averageLux = luxData.length > 0
    ? (luxData.reduce((sum, item) => sum + item.lux, 0) / luxData.length).toFixed(2)
    : 'ไม่มีข้อมูล';

  return (
    <div className="flex flex-col w-full h-full absolute overflow-x-hidden overflow-visible bg-gray-50 p-4 sm:p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">แดชบอร์ดข้อมูลเซ็นเซอร์วัดแสง</h1>
        <p className="text-gray-500 mt-1">แสดงข้อมูล {luxData.length} ค่าล่าสุดจากเซ็นเซอร์ (โหลดข้อมูลจาก Server)</p>
        {isLoadingMore && (
          <p className="text-sm text-indigo-500 animate-pulse mt-1">
            กำลังโหลดข้อมูลเพิ่มเติม... ({loadedCount} รายการ)
          </p>
        )}
      </header>

      {/* 1. ส่วนการ์ดแสดงผล */}
      <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-transform duration-200 hover:scale-[1.02]">
          <h3 className="text-sm font-medium text-gray-500">ค่า Lux ปัจจุบัน</h3>
          <p className="text-4xl font-extrabold text-indigo-600 mt-2">{latestLux}</p>
          <p className="text-sm text-gray-400 mt-1">lx</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-transform duration-200 hover:scale-[1.02]">
          <h3 className="text-sm font-medium text-gray-500">ค่า Lux เฉลี่ย</h3>
          <p className="text-4xl font-extrabold text-teal-600 mt-2">{averageLux}</p>
          <p className="text-sm text-gray-400 mt-1">จากข้อมูล {luxData.length} รายการ</p>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex justify-center items-center text-gray-400">
          พื้นที่สำหรับแสดงสถานะเพิ่มเติม
        </div>
      </section>

      {/* 2. ส่วนกราฟเส้น */}
      <section className="mb-10 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">กราฟค่า Lux ตามช่วงเวลา</h2>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={luxData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="time" interval={luxData.length > 50 ? 9 : 0} angle={-15} textAnchor="end" height={50} />
              <YAxis domain={['dataMin', 'dataMax']} label={{ value: 'ค่า Lux (lx)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
              <Tooltip
                formatter={(value: number) => [`${value} lx`, 'ค่า Lux']}
                labelFormatter={(label: string, payload: readonly any[]) => `เวลา: ${payload[0]?.payload?.fullTime || label}`}
              />
              <Line type="monotone" dataKey="lux" stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 3. ส่วนตารางข้อมูล */}
      <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">ข้อมูลดิบ (ล่าสุด)</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ค่า Lux</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เวลาที่บันทึก</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {luxData.slice().reverse().map((item: ProcessedLuxData) => (
                <tr key={item.id} className="hover:bg-indigo-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.lux}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.fullTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
