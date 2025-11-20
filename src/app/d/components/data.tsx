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

export async function getLuxData(): Promise<{ data: ProcessedLuxData[]; error: string | null }> {
  const API_URL = 'http://dserver.thddns.net:6863/all/lux_values';

  try {
    // ดึงข้อมูลบน Server โดยใช้ { cache: 'no-store' } เพื่อให้ได้ข้อมูลใหม่ทุกครั้ง
    const response = await fetch(API_URL, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // ประมวลผลและจัดรูปแบบข้อมูล
    if (result && result.msg && Array.isArray(result.msg)) {
      const processedData = result.msg.map((item: ApiLuxRecord) => ({
        id: item.id,
        lux: item.lux_value,
        time: new Date(item.data_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        fullTime: item.data_time
      })).slice(-100); // ดึงข้อมูล 100 รายการล่าสุด

      return { data: processedData, error: null };
    } else {
      // จัดการกรณีที่โครงสร้าง API response ไม่เป็นไปตามที่คาดไว้
      return { data: [], error: "รูปแบบข้อมูลที่ได้รับจาก API ไม่ถูกต้อง" };
    }
  } catch (e) {
    console.error(`Failed to fetch lux data:`, e);
    return { data: [], error: "เกิดข้อผิดพลาดในการโหลดข้อมูล โปรดตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์ FastAPI" };
  }
}
