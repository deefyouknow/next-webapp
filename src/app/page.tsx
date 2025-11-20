"use client"
import { useState, useEffect } from 'react';
import React from 'react';
import NavBar from '../components/appbar/navbar';
import Link from 'next/link';
import { useAuth } from '../components/useauth';
import Page from './t/page'
import HomePage from './dashboard/page';
import Homee from './d/page';
import PageA from './a/page';

export default function App() {
  const { isLoggedIn, user } = useAuth();
  
  return (
    <>
      <div className={`bg-black flex flex-col overflow-hidden relative m-0 p-0 w-[100dvw] h-[100dvh]`}>
        <NavBar />
        <div className='flex bg-white h-full w-full'>
          {isLoggedIn && 
          <div className='bg-amber-300 w-full h-full'>
            <HomePage />
          </div>
          }
          {!isLoggedIn && 
          <Page />
          
          }
        </div>
      </div>
    </>
  )
}
