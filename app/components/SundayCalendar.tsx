"use client"

import { useEffect, useRef } from "react"
import { isSameDay, startOfDay } from "date-fns"
import { groupSundaysByMonth } from "../utils/dateUtils"
import SundayCard, { type SundayStatus } from "./SundayCard"
import CalendarHero from "./CalendarHero"
import CalendarMonths from "./CalendarMonths"

export interface SundayData {
  status?: SundayStatus
  message?: string
  messageColor?: string
}

interface SundayCalendarProps {
  sundays: Date[]
  calendarDates: { start: Date; end: Date } | null
  sundayData: Record<string, SundayData>
  loading?: boolean
  error?: string | null
}

// Presentational calendar, separate from Firestore so it can render with any data
export default function SundayCalendar({ sundays, calendarDates, sundayData, loading, error }: SundayCalendarProps) {
  const currentMonthRef = useRef<HTMLElement>(null)
  const sundaysByMonth = groupSundaysByMonth(sundays, calendarDates?.start, calendarDates?.end)
  const today = startOfDay(new Date())
  const nextSunday = sundays.find((sunday) => sunday >= today)
  const schoolYear = calendarDates
    ? `${calendarDates.start.getFullYear()}–${calendarDates.end.getFullYear()}`
    : undefined

  // Scroll to the current month once data is in
  useEffect(() => {
    if (!loading && currentMonthRef.current) {
      setTimeout(() => {
        currentMonthRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }, [loading])

  return (
    <>
      <CalendarHero schoolYear={schoolYear} />
      <div className="container mx-auto px-4 py-10">
        {error ? (
          <div role="alert" className="mx-auto max-w-md rounded-xl border border-brick/30 bg-card p-6 text-center text-card-foreground">
            <p className="font-display font-semibold text-brick">Couldn&apos;t load the calendar</p>
            <p className="mt-1 text-sm text-muted-foreground dark:text-brand/70">{error}</p>
          </div>
        ) : loading ? (
          <div aria-busy="true" aria-label="Loading calendar" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-[150px] animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : (
          <CalendarMonths
            sundaysByMonth={sundaysByMonth}
            currentMonthRef={currentMonthRef}
            renderCard={(sunday, dateString) => {
              const data = sundayData[dateString] || {}
              const isNext = nextSunday && isSameDay(sunday, nextSunday)
              return (
                <SundayCard
                  date={sunday}
                  status={data.status}
                  message={data.message}
                  messageColor={data.messageColor}
                  highlight={isNext ? (isSameDay(sunday, today) ? "today" : "next") : undefined}
                  isPast={sunday < today}
                />
              )
            }}
          />
        )}
      </div>
    </>
  )
}
