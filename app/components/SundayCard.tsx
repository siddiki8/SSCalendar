import type React from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getIslamicDate } from "../utils/dateUtils"

export type SundayStatus = "normal" | "closed" | "event"

interface SundayCardProps {
  date: Date
  status?: SundayStatus
  message?: string
  messageColor?: string
  highlight?: "today" | "next"
  isPast?: boolean
  isActive?: boolean
  action?: React.ReactNode
}

const bandStyles: Record<SundayStatus, string> = {
  normal: "bg-brand text-white",
  event: "bg-gold text-gold-foreground",
  closed: "bg-brick text-white",
}

const statusLabels: Partial<Record<SundayStatus, string>> = {
  event: "Event",
  closed: "Closed",
}

export default function SundayCard({
  date,
  status = "normal",
  message,
  messageColor,
  highlight,
  isPast,
  isActive,
  action,
}: SundayCardProps) {
  const label = statusLabels[status]
  // Black was the old default; let it follow the card's own text color instead
  const customColor = messageColor && messageColor !== "#000000" ? messageColor : undefined

  return (
    <article
      className={cn(
        "relative flex min-h-[150px] flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md",
        highlight && "ring-2 ring-gold ring-offset-2 ring-offset-background",
        isActive && "ring-2 ring-brand ring-offset-2 ring-offset-background",
        isPast && "opacity-60"
      )}
    >
      <div className={cn("flex items-center gap-3 px-4 py-3", bandStyles[status])}>
        <time dateTime={format(date, "yyyy-MM-dd")} className="font-display text-3xl font-semibold leading-none tabular-nums">
          {format(date, "d")}
        </time>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="font-display text-sm font-semibold">{format(date, "MMMM")}</p>
          <p className="text-xs opacity-80">{getIslamicDate(date)}</p>
        </div>
        {label && (
          <span className="rounded-full bg-black/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
            {label}
          </span>
        )}
        {action}
      </div>
      {highlight && (
        <p className="bg-gold/20 px-4 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand">
          {highlight === "today" ? "Today" : "Next Sunday"}
        </p>
      )}
      <div className="flex flex-1 items-center justify-center p-4 text-center">
        {message ? (
          <p className="text-base font-semibold text-balance" style={{ color: customColor }}>
            {message}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground dark:text-brand/60">
            {status === "closed" ? "No class" : "Regular class"}
          </p>
        )}
      </div>
    </article>
  )
}
