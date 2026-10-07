"use client"

import { useState, useEffect } from "react"
import { collection, query, onSnapshot, doc } from "firebase/firestore"
import { db } from "../firebase/config"
import { getSundays, getSundaysBetween } from "../utils/dateUtils"
import SundayCalendar, { type SundayData } from "./SundayCalendar"

export default function SundayGrid() {
  // Instead of hardcoding Sundays, we listen for live calendar settings.
  const [calendarDates, setCalendarDates] = useState<{ start: Date; end: Date } | null>(null)
  const sundays = calendarDates
    ? getSundaysBetween(calendarDates.start, calendarDates.end)
    : getSundays(new Date().getFullYear())

  const [sundayData, setSundayData] = useState<Record<string, SundayData>>({})
  const [loading, setLoading] = useState(true)
  // Stay in the loading state until the live school year is known, so the
  // page doesn't render (and scroll) the fallback year and then reflow
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Listen for live calendar settings so the displayed date range updates
  useEffect(() => {
    let unsubscribeCal: (() => void) | undefined
    const liveCalendarRef = doc(db, "settings", "liveCalendar")
    const unsubscribeLive = onSnapshot(liveCalendarRef, (docSnap) => {
      unsubscribeCal?.()
      if (docSnap.exists()) {
        const liveCal = docSnap.data().value // e.g., "2024-2025"
        const calendarRef = doc(db, "calendars", liveCal)
        unsubscribeCal = onSnapshot(calendarRef, (calSnap) => {
          if (calSnap.exists()) {
            const data = calSnap.data()
            setCalendarDates({
              start: new Date(data.start),
              end: new Date(data.end)
            })
          }
          setLoadingSettings(false)
        }, () => setLoadingSettings(false))
      } else {
        setLoadingSettings(false)
      }
    }, () => setLoadingSettings(false))

    return () => {
      unsubscribeCal?.()
      unsubscribeLive()
    }
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

  return (
    <SundayCalendar
      sundays={sundays}
      calendarDates={calendarDates}
      sundayData={sundayData}
      loading={loading || loadingSettings}
      error={error}
    />
  )
}
