"use client";
import { useState } from "react";
import { FaBars, FaHome, FaRobot, FaDatabase } from "react-icons/fa";
import Link from "next/link";
import { useLocation } from 'react-router-dom';

export default function Sidebar(
  { href, Icon, text, isOpen, setIsOpenAction }: { href: string; Icon: any; text: string; isOpen: boolean; setIsOpenAction: (value: boolean) => void } // <--- รับ Prop ชื่อใหม่
) {
  
  const [currentPath, setCurrentPath] = useState<string>('');
  console.log(currentPath);
  
    return (
      <>
        <div className={`flex flex-col h-full bg-gray-100 duration-75 ${isOpen ? 'w-full md:w-[305px] p-2' : 'w-0 overflow-hidden'}`}>
          <div className="bg-amber-300 h-full w-full flex flex-col flex-shrink-0">
            <Link href="/" className="flex items-center justify-center md:justify-start space-x-4 w-full shadow-xs h-12 text-gray-800 hover:bg-gray-200">
              <FaHome className="w-6 h-6" />
              <h1>HOME</h1>
              {String(currentPath)}
            </Link>
            <Link href="/ai" className="flex items-center justify-center md:justify-start space-x-4 w-full shadow-xs h-12 text-gray-800 hover:bg-gray-200">
              <FaRobot className="w-6 h-6" />
              <h1>AI</h1>
            </Link>
            <Link href="/pagetwo" className="flex items-center justify-center md:justify-start space-x-4 w-full shadow-xs h-12 text-gray-800 hover:bg-gray-200">
              <FaDatabase className="w-6 h-6" />
              <h1>Database</h1>
            </Link>
          </div>
        </div>
      </>
    )
  }
