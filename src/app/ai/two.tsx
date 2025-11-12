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

      const res = await fetch("http://dserver.thddns.net:6863/proxy_capgen", {
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
    <div className="bg-gray-50 absolute w-full h-full min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md mx-auto p-6 sm:p-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            สร้าง Caption จากรูปภาพ
          </h1>
          <p className="text-gray-500">
            อัปโหลดภาพ (รองรับ HEIC) แล้ว AI จะช่วยเขียนคำบรรยายให้
          </p>
        </div>

        <div className="space-y-6">
          <label
            htmlFor="file-upload"
            className="w-full flex items-center justify-center gap-x-2.5 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            {preview ? "เลือกภาพอื่น" : "เลือกไฟล์ภาพ"}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*, .heic"
            onChange={handleUpload}
            className="hidden"
          />

          <div className="space-y-4">
            {preview && (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-2 bg-gray-50">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto max-h-[40vh] object-contain rounded-lg"
                />
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center space-x-3 text-blue-600 p-4 bg-blue-50 rounded-lg">
                <svg
                  className="animate-spin h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="font-medium text-lg">กำลังประมวลผล...</span>
              </div>
            )}

            {error && !loading && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-r-md"
                role="alert"
              >
                <p className="font-bold">เกิดข้อผิดพลาด</p>
                <p>{error.replace("❌ อัปโหลดไม่สำเร็จ: ", "")}</p>
              </div>
            )}

            {result && !loading && (
              <div className="border-t border-gray-200 pt-5 space-y-3">
                <h2 className="text-xl font-semibold text-gray-800">ผลลัพธ์:</h2>
                <div className="bg-gray-100 p-4 rounded-lg space-y-4">
                  <div>
                    <strong className="font-medium text-gray-600 text-sm">Filename:</strong>{" "}
                    <code className="block text-sm bg-gray-200 text-gray-800 px-2 py-1 rounded mt-1 break-all">
                      {result.filename}
                    </code>
                  </div>
                  <div>
                    <strong className="font-medium text-gray-600 text-sm block mb-1">
                      Caption ที่สร้างโดย AI:
                    </strong>
                    <p className="text-base bg-white p-4 rounded-md shadow-sm text-gray-900 leading-relaxed">
                      {result.caption}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
