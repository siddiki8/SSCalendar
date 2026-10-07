"use client"

import SundayGrid from "./components/SundayGrid"
import SiteHeader from "./components/SiteHeader"
import { ThemeToggle } from "./components/ThemeToggle"

export default function Home() {
  return (
    <main className="min-h-screen">
      <SiteHeader title="Sunday School">
        <ThemeToggle />
      </SiteHeader>
      <SundayGrid />
    </main>
  )
}
