"use client"
import { useState } from "react"
import Image from "next/image";

export default function Home() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Overlay ด้านหลัง (แสดงเฉพาะตอนเปิด) */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`
          fixed top-0 left-0 min-h-full w-64 bg-gray-500 text-white p-4
          transform transition-transform duration-300 z-20
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
        <ul className="space-y-4">
          <li><a href="#">Home</a></li>
          <li><a href="/pagetwo">About</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>

      {/* Content */}
      <main className="flex-1 bg-gray-300 p-6">
        {/* ปุ่มสามขีด */}
        <button
          className="md:hidden bg-gray-700 text-white px-4 py-2 rounded"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>

      </main>
    </div>
  )
}
