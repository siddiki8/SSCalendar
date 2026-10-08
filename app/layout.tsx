import "./globals.css"
import { Inter, Poppins } from "next/font/google"
import type React from "react"
import { Providers } from "./providers"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata = {
  title: "Sunday School Calendar | Darul Islah",
  description: "Sunday School schedule for Darul Islah",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans min-h-screen transition-colors duration-200">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
