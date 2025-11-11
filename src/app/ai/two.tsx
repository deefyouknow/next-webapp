"use client";
import { useState } from "react";

export default function UploadFromiPhone() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🧩 แปลง HEIC + ย่อภาพอัตโนมัติ
  const convertAndCompress = async (file: File): Promise<File> => {
    let input = file;

    // ✅ แปลง HEIC → JPEG
    if (file.type.includes("heic") || file.name.toLowerCase().endsWith(".heic")) {
      const heic2any = (await import("heic2any")).default;
      const blob = await heic2any({ blob: file, toType: "image/jpeg" });
      input = new File([blob as BlobPart], file.name.replace(/\.heic$/i, ".jpg"), {
        type: "image/jpeg",
      });
    }

    // ✅ ครอปและย่อขนาด
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) return reject("โหลดภาพไม่สำเร็จ");
        img.src = e.target.result as string;
      };
      img.onload = async () => {
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        let scale = 1;
        let blob: Blob | null = null;

        while (true) {
          canvas.width = size * scale;
          canvas.height = size * scale;
          ctx.drawImage(
            img,
            (img.width - size) / 2,
            (img.height - size) / 2,
            size,
            size,
            0,
            0,
            canvas.width,
            canvas.height
          );
          blob = await new Promise<Blob | null>((res) =>
            canvas.toBlob((b) => res(b), "image/jpeg", 0.85)
          );
          if (!blob) return reject("สร้าง blob ไม่ได้");
          if (blob.size <= 2 * 1024 * 1024) break; // ✅ ไม่เกิน 2 MB แล้ว
          scale *= 0.8;
        }

        resolve(new File([blob!], input.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" }));
      };
      reader.readAsDataURL(input);
    });
  };

  // 📤 อัปโหลดไป FastAPI
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const processed = await convertAndCompress(file);
      const formData = new FormData();
      formData.append("file", processed);

      const res = await fetch("http://10.1.3.0:8000/proxy_capgen", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("❌ อัปโหลดไม่สำเร็จ: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // 🖥️ UI
  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-lg font-bold text-center">อัปโหลดภาพ</h1>
      <input
        type="file"
        accept="image/*, .heic"
        onChange={handleUpload}
        className="block border rounded p-2 w-full"
      />
      {preview && (
        <img src={preview} alt="preview" className="mt-4 max-w-full border rounded shadow mx-auto" />
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
