import "./globals.css"
import { GeistSans } from "geist/font/sans"
import type React from "react"
import { Providers } from "./providers"

export const metadata = {
  title: "Sunday School Calendar",
  description: "Simple Calendar app for Sunday School",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.className} paper-texture min-h-screen bg-white dark:bg-emerald-950 text-gray-900 dark:text-white transition-colors duration-200`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}



import './globals.css'