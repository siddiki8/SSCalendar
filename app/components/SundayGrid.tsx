"use client"

import { useState, useEffect, useRef } from "react"
import { collection, query, onSnapshot, doc } from "firebase/firestore"
import { db } from "../firebase/config"
import { getSundays, getSundaysBetween } from "../utils/dateUtils"
import SundayCard from "./SundayCard"
import { format } from "date-fns"

interface SundayData {
  status?: "closed" | "event"
  message?: string
  messageColor?: string
}

// Helper function to group Sundays by month
function groupSundaysByMonth(sundays: Date[], startDate?: Date, endDate?: Date) {
  const groups: { [key: string]: Date[] } = {}
  
  sundays.forEach(sunday => {
    // Skip if the sunday is before start date or after end date
    if (
      (startDate && sunday < startDate) ||
      (endDate && sunday > endDate)
    ) {
      return
    }

    const monthKey = format(sunday, 'MMMM yyyy')
    if (!groups[monthKey]) {
      groups[monthKey] = []
    }
    groups[monthKey].push(sunday)
  })
  
  return groups
}

export default function SundayGrid() {
  const currentMonthRef = useRef<HTMLDivElement>(null)
  // Instead of hardcoding Sundays, we listen for live calendar settings.
  const [calendarDates, setCalendarDates] = useState<{ start: Date; end: Date } | null>(null)
  const sundays = calendarDates
    ? getSundaysBetween(calendarDates.start, calendarDates.end)
    : getSundays(new Date().getFullYear())

  const [sundayData, setSundayData] = useState<Record<string, SundayData>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Group Sundays by month
  const sundaysByMonth = groupSundaysByMonth(
    sundays,
    calendarDates?.start,
    calendarDates?.end
  )

  // Listen for live calendar settings so the displayed date range updates
  useEffect(() => {
    const liveCalendarRef = doc(db, "settings", "liveCalendar")
    const unsubscribeLive = onSnapshot(liveCalendarRef, (docSnap) => {
      if (docSnap.exists()) {
        const liveCal = docSnap.data().value // e.g., "2024-2025"
        const calendarRef = doc(db, "calendars", liveCal)
        onSnapshot(calendarRef, (calSnap) => {
          if (calSnap.exists()) {
            const data = calSnap.data()
            setCalendarDates({
              start: new Date(data.start),
              end: new Date(data.end)
            })
          }
        })
      }
    })

    return () => unsubscribeLive()
  }, [])

  // Listen for Sunday event data
  useEffect(() => {
    const q = query(collection(db, "sundays"))
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: Record<string, SundayData> = {}
        querySnapshot.forEach((doc) => {
          data[doc.id] = doc.data() as SundayData
        })
        setSundayData(data)
        setLoading(false)
      },
      (err) => {
        console.error("Firestore error:", err)
        setError("Failed to load calendar data. Please try again later.")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Add scroll to current month effect
  useEffect(() => {
    if (!loading && currentMonthRef.current) {
      setTimeout(() => {
        window.scrollTo({
          top: currentMonthRef.current?.offsetTop - 20,
          behavior: "smooth"
        })
      }, 100)
    }
  }, [loading])

  if (loading) {
    return <div className="text-center py-4">Loading calendar...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  const currentMonth = format(new Date(), 'MMMM yyyy')

  return (
    <div className="space-y-8 pt-4">
      {Object.entries(sundaysByMonth).map(([month, monthSundays]) => (
        <div 
          key={month} 
          className="space-y-2"
          ref={month === currentMonth ? currentMonthRef : undefined}
        >
          <h2 className="text-2xl font-bold px-4">{month}</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {monthSundays.map((sunday) => {
              const dateString = sunday.toISOString().split("T")[0]
              const data = sundayData[dateString] || {}
              return (
                <SundayCard
                  key={dateString}
                  date={sunday}
                  status={data.status}
                  message={data.message}
                  messageColor={data.messageColor}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

