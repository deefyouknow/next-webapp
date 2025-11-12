"use client";
import { useState } from "react";
import { FaBars, FaHome, FaRobot, FaDatabase } from "react-icons/fa";
import Link from "next/link";
import { useLocation } from 'react-router-dom';

export default function Sidebar(
  { isOpen, setIsOpenAction }: { isOpen: boolean; setIsOpenAction: (value: boolean) => void } // <--- รับ Prop ชื่อใหม่
) {

    return (  
      <>
        <div className={`flex flex-col h-full bg-gray-900 text-white transition-all duration-300 ease-in-out ${isOpen ? 'w-full md:w-64 p-4' : 'w-0 p-0 overflow-hidden'}`}>
          <div className="flex flex-col space-y-2">
            <Link 
              href="/" 
              className="flex items-center p-3 space-x-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
              onClick={() => setIsOpenAction(false)}
            >
              <FaHome className="w-6 h-6" />
              <span className="font-semibold">HOME</span>
            </Link>
            <Link 
              href="/ai" 
              className="flex items-center p-3 space-x-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
              onClick={() => setIsOpenAction(false)}
            >
              <FaRobot className="w-6 h-6" />
              <span className="font-semibold">AI</span>
            </Link>
            <Link 
              href="/pagetwo" 
              className="flex items-center p-3 space-x-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
              onClick={() => setIsOpenAction(false)}
            >
              <FaDatabase className="w-6 h-6" />
              <span className="font-semibold">Database</span>
            </Link>
          </div>
        </div>
      </>
    )
  }
