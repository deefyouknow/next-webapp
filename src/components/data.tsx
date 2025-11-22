export interface ApiLuxRecord {
  id: number;
  lux_value: number;
  data_time: string;
}

export interface ProcessedLuxData {
  id: number;
  lux: number;
  time: string;
  fullTime: string;
}

export async function getLuxData(skip: number = 0, limit: number = 100): Promise<{ data: ProcessedLuxData[]; error: string | null }> {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/lux/all/lux_value?skip=${skip}&limit=${limit}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

    // ดึงข้อมูลบน Server โดยใช้ { cache: 'no-store' } เพื่อให้ได้ข้อมูลใหม่ทุกครั้ง
    const response = await fetch(API_URL, {
      cache: 'no-store',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // ประมวลผลและจัดรูปแบบข้อมูล
    if (Array.isArray(result)) {
      const processedData = result.map((item: ApiLuxRecord) => ({
        id: item.id,
        lux: item.lux_value,
        time: new Date(item.data_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        fullTime: item.data_time
      }));

      return { data: processedData, error: null };
    } else {
      // จัดการกรณีที่โครงสร้าง API response ไม่เป็นไปตามที่คาดไว้
      return { data: [], error: "รูปแบบข้อมูลที่ได้รับจาก API ไม่ถูกต้อง" };
    }
  } catch (e: any) {
    console.error(`Failed to fetch lux data:`, e);
    if (e.name === 'AbortError') {
      return { data: [], error: "หมดเวลาการเชื่อมต่อ (Timeout) - ไม่สามารถดึงข้อมูลได้ภายใน 30 วินาที" };
    }
    return { data: [], error: "เกิดข้อผิดพลาดในการโหลดข้อมูล โปรดตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์ FastAPI" };
  }
}
