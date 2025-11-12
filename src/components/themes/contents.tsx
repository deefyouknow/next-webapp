"use client";
import { Children, useState } from "react";
import { FaBars, FaHome } from "react-icons/fa";
import Link from "next/link";

export default function Content(
  { isOpen, setIsOpenAction, children }: { isOpen: boolean; setIsOpenAction: (value: boolean) => void; children: React.ReactNode }
) { 
  return (
    <>
      <div className={`flex h-full w-full ${isOpen ? 'hidden md:flex' : ''}`}>
        {children}
      </div>
    </>
  )
}
