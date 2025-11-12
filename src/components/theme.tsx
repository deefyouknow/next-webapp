"use client";
import { useState } from "react";
import { FaBars, FaHome } from "react-icons/fa";
import Link from "next/link";
import Navbar from "./themes/navbars";
import Sidebar from "./themes/sidebar";
import Content from "./themes/contents";

export default function ThemesDefault({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <div className="relative h-screen w-screen flex flex-col overflow-hidden">
        {/*NavBar*/}
        <Navbar isOpen={isOpen} setIsOpenAction={setIsOpen} /> 
        <div className="flex flex-row h-full w-full">
          {/*Sidebar*/}
          <Sidebar isOpen={isOpen} setIsOpenAction={setIsOpen} />
          {/*Content*/}
          <Content isOpen={isOpen} setIsOpenAction={setIsOpen} children={children} />
        </div>
      </div>
    </>
  );
}
