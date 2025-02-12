"use client"

import SundayGrid from "./components/SundayGrid"
import { ThemeToggle } from "./components/ThemeToggle"
import Image from "next/image"

export default function Home() {
  return (
    <main className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Sunday School Calendar</h1>
        <ThemeToggle />
      </div>
      <div className="flex items-center gap-4 mb-4">
        <Image 
          src="/logo.png" 
          alt="Darul Islah Logo" 
          width={50} 
          height={50}
          className="object-contain"
        />
      </div>
      <SundayGrid />
    </main>
  )
}

