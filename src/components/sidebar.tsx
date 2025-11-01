"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen relative">
      {/* ปุ่ม toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar ลอย */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-64"}`}
      >
        <h1 className="text-2xl font-bold mb-6">🌙 MENU</h1>
        <ul className="space-y-4">
          <li><Link href="/">🏠 Home</Link></li>
          <li><Link href="/pagetwo">📄 Page Two</Link></li>
          <li><Link href="/ai">🤖 AI Page</Link></li>
          <li><Link href="/login">🔐 Login</Link></li>
        </ul>
      </aside>

      {/* เนื้อหาแต่ละหน้า */}
      <main
        className={`transition-all duration-300 ${
          open ? "ml-64" : "ml-0"
        } p-6`}
      >
        {children}
      </main>
    </div>
  );
}
