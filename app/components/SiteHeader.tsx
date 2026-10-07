import Image from "next/image"
import Link from "next/link"
import type React from "react"

interface SiteHeaderProps {
  title: string
  children?: React.ReactNode
}

export default function SiteHeader({ title, children }: SiteHeaderProps) {
  return (
    <header className="border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Image src="/logo.png" alt="Darul Islah" width={44} height={44} className="object-contain dark:brightness-125" />
          <div className="whitespace-nowrap leading-tight">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Darul Islah</p>
            <p className="font-display text-lg font-semibold sm:text-xl">{title}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </header>
  )
}
