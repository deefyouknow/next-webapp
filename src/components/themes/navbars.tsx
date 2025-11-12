"use client";
import { useState } from "react";
import { FaBars, FaHome } from "react-icons/fa";
import Link from "next/link";

export default function Navbar(
  { isOpen, setIsOpenAction }: { isOpen: boolean; setIsOpenAction: (value: boolean) => void } // <--- รับ Prop ชื่อใหม่
) {

  return (
    <nav className="bg-gray-800 text-white w-full h-13 flex-row flex top-0">
      <div className="flex h-full w-full justify-between items-center mx-4">
        <button className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 active:bg-gray-500 flex justify-center items-center"
          onClick={() => setIsOpenAction(!isOpen)}
        >
          <FaBars className="" />
        </button>
        <div className="flex justify-center items-center space-x-5">
          <h1 className="opacity-0">{String(isOpen)}</h1>
          <Link href="/login"
            onClick={() => setIsOpenAction(false)}
            className="hover:text-gray-300"
          >
            Login
          </Link>
          <img
            src="https://picsum.photos/200"
            alt="Logo"
            className="size-8 rounded-full"
          />
        </div>
      </div>
    </nav>
  );
}
