"use client";
import { useState } from "react";

export default function UploadCropPNG() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<{ OK?: boolean; caption?: string; filename?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🧩 ครอป + ย่อ + แปลง PNG (auto compress & HEIC fix)
  const cropAndCompressToPNG = async (file: File): Promise<File> => {
    let inputFile = file;

    // ✅ แปลง HEIC → JPEG (โหลด heic2any เฉพาะตอนรันใน browser)
    if (file.type.includes("heic") || file.name.toLowerCase().endsWith(".heic")) {
      const heic2any = (await import("heic2any")).default;
      const blob = await heic2any({ blob: file, toType: "image/jpeg" });
      inputFile = new File([blob as BlobPart], file.name.replace(/\.heic$/i, ".jpg"), {
        type: "image/jpeg",
      });
    }

    const img = new Image();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        if (!e.target?.result) return reject("ไม่มีข้อมูลไฟล์");
        img.src = e.target.result as string;
      };

      img.onerror = () => reject("❌ โหลดภาพไม่สำเร็จ (format ไม่รองรับ)");

      img.onload = async () => {
        let { width, height } = img;

        // 🔲 ครอปตรงกลางให้เป็นสี่เหลี่ยมจัตุรัส
        const size = Math.min(width, height);
        const offsetX = (width - size) / 2;
        const offsetY = (height - size) / 2;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        let scale = 1;
        let blob: Blob | null = null;

        // 🔁 วนย่อจนไม่เกิน 2MB
        while (true) {
          canvas.width = size * scale;
          canvas.height = size * scale;
          ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, canvas.width, canvas.height);

          blob = await new Promise<Blob | null>((res) =>
            canvas.toBlob((b) => res(b), "image/png", 0.9)
          );

          if (!blob) return reject("ไม่สามารถสร้าง blob ได้");
          if (blob.size <= 2 * 1024 * 1024) break;

          scale *= 0.8; // ลดขนาดลง 20% แล้ววนใหม่
          console.log("🔄 ย่ออีกครั้ง:", (blob.size / 1024 / 1024).toFixed(2), "MB");
        }

        const newFile = new File([blob!], file.name.replace(/\.[^/.]+$/, ".png"), {
          type: "image/png",
        });
        resolve(newFile);
      };

      reader.readAsDataURL(inputFile);
    });
  };

  // 📤 อัปโหลดไปยัง API
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const uploadFile = await cropAndCompressToPNG(file);
      setPreview(URL.createObjectURL(uploadFile));

      const formData = new FormData();
      formData.append("file", uploadFile);

      const res = await fetch("https://api.aiforthai.in.th/capgen", {
        method: "POST",
        headers: { apikey: "HZjwa5ueL1LSWyN5fsj6t0DQSyqI2cGL" },
        body: formData,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("⚠️ ไม่สามารถอัปโหลดได้: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // 🖥️ UI
  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-lg font-bold text-center">📸 AI Caption (Crop + PNG + HEIC Fix)</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="block border rounded p-2 w-full"
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="mt-4 max-w-full border rounded shadow mx-auto"
        />
      )}

      {loading && <p className="text-blue-500 text-center">⏳ กำลังประมวลผล...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {result && (
        <div className="mt-4 border p-3 rounded bg-gray-100 text-sm">
          <p><b>OK:</b> {String(result.OK)}</p>
          <p><b>Filename:</b> {result.filename}</p>
          <p><b>Caption:</b> {result.caption}</p>
        </div>
      )}
    </div>
  );
}
