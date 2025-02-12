"use client"

import { useState, useEffect } from "react"
import { collection, query, onSnapshot, doc, updateDoc, setDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import { getSundays, getSundaysBetween } from "../utils/dateUtils"
import EditableSundayCard from "./EditableSundayCard"
import EditSundayModal from "./EditSundayModal"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
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

export default function AdminPanel() {
  // Instead of using static sundays, we will either use the live calendar settings
  // or fallback to the current year's Sundays.
  const [calendarDates, setCalendarDates] = useState<{ start: Date; end: Date } | null>(null)
  const sundays = calendarDates
    ? getSundaysBetween(calendarDates.start, calendarDates.end)
    : getSundays(new Date().getFullYear())
  const [editingDate, setEditingDate] = useState<Date | null>(null)
  const [sundayData, setSundayData] = useState<Record<string, SundayData>>({})
  const [loadingSundays, setLoadingSundays] = useState(true)
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liveCalendar, setLiveCalendar] = useState<string>("")
  const calendarOptions = ["2024-2025", "2025-2026", "2026-2027", "2027-2028", "2028-2029", "2029-2030"]

  // States for editing a calendar's dates
  const [selectedCalendarEdit, setSelectedCalendarEdit] = useState<string>("")
  const [firstSundayEdit, setFirstSundayEdit] = useState<Date | undefined>(undefined)
  const [lastSundayEdit, setLastSundayEdit] = useState<Date | undefined>(undefined)

  // Group Sundays by month
  const sundaysByMonth = groupSundaysByMonth(
    sundays,
    calendarDates?.start,
    calendarDates?.end
  )

  // Helper functions for default date calculations
  function getFirstSundayInMonth(year: number, month: number): Date {
    // Create a new date on the first of the specified month
    const date = new Date(year, month, 1);
    while (date.getDay() !== 0) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  }

  function getLastSundayInMonth(year: number, month: number): Date {
    // Get the first day of the next month, then subtract one day to get last day of target month
    const date = new Date(year, month + 1, 0);
    while (date.getDay() !== 0) {
      date.setDate(date.getDate() - 1);
    }
    return date;
  }

  // Listen for live calendar settings so the displayed date range updates
  useEffect(() => {
    const liveCalendarRef = doc(db, "settings", "liveCalendar")
    const unsubscribeLive = onSnapshot(liveCalendarRef, (docSnap) => {
      if (docSnap.exists()) {
        const liveCal = docSnap.data().value // e.g., "2024-2025"
        const calendarRef = doc(db, "calendars", liveCal)
        const unsubscribeCal = onSnapshot(calendarRef, (calSnap) => {
          if (calSnap.exists()) {
            const data = calSnap.data()
            setCalendarDates({
              start: new Date(data.start),
              end: new Date(data.end)
            })
          }
          setLoadingSettings(false)
        })
        // Cleanup calendar listener as well.
        return () => unsubscribeCal()
      } else {
        // If the live calendar document does not exist, stop loading.
        setLoadingSettings(false)
      }
    })
    return () => unsubscribeLive()
  }, [])

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
        setLoadingSundays(false)
      },
      (err) => {
        console.error("Firestore error:", err)
        setError("Failed to load calendar data. Please try again later.")
        setLoadingSundays(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleEditClick = (date: Date) => {
    setEditingDate(date)
  }

  const handleCloseEdit = () => {
    setEditingDate(null)
  }

  const [showEditConfirmDialog, setShowEditConfirmDialog] = useState(false)
  const [showLiveConfirmDialog, setShowLiveConfirmDialog] = useState(false)

  const handleCalendarEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCalendarEdit || !firstSundayEdit || !lastSundayEdit) {
      alert("Please fill in all fields for editing the calendar.")
      return
    }

    setShowEditConfirmDialog(true)
  }

  const handleConfirmEdit = async () => {
    try {
      if (!firstSundayEdit || !lastSundayEdit) {
        console.error("Start or end date is undefined");
        return;
      }

      const calendarDoc = doc(db, "calendars", selectedCalendarEdit)
      await setDoc(calendarDoc, {
        start: firstSundayEdit.toISOString(),
        end: lastSundayEdit.toISOString()
      }, { merge: true })
      console.log("Calendar updated:", selectedCalendarEdit)
      setShowEditConfirmDialog(false)
    } catch (err) {
      console.error(err)
      // You might want to show an error dialog here
    }
  }

  const handleLiveCalendarSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!liveCalendar) {
      return
    }

    setShowLiveConfirmDialog(true)
  }

  const handleConfirmLive = async () => {
    try {
      const liveCalendarDoc = doc(db, "settings", "liveCalendar")
      await setDoc(liveCalendarDoc, { value: liveCalendar }, { merge: true })
      console.log("Live calendar updated:", liveCalendar)
      setShowLiveConfirmDialog(false)
    } catch (err) {
      console.error(err)
      // You might want to show an error dialog here
    }
  }

  if (loadingSundays || loadingSettings) {
    return <div className="text-center py-4">Loading calendar...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  return (
    <div className="relative">
      {editingDate && (
        <EditSundayModal
          date={editingDate}
          onClose={handleCloseEdit}
          initialData={sundayData[editingDate.toISOString().split("T")[0]] || {}}
        />
      )}
      <div
        className={`space-y-8 ${editingDate ? "opacity-50 pointer-events-none" : ""}`}
      >
        {Object.entries(sundaysByMonth).map(([month, monthSundays]) => (
          <div key={month} className="space-y-2">
            <h2 className="text-2xl font-bold px-4">{month}</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {monthSundays.map((sunday) => {
                const dateString = sunday.toISOString().split("T")[0]
                const data = sundayData[dateString] || {}
                return (
                  <EditableSundayCard
                    key={dateString}
                    date={sunday}
                    status={data.status}
                    message={data.message}
                    messageColor={data.messageColor}
                    onEditClick={() => handleEditClick(sunday)}
                    isActive={editingDate ? sunday.toDateString() === editingDate.toDateString() : false}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <section className="mt-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Edit Calendar</h2>
        <form onSubmit={handleCalendarEditSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Select Calendar to Edit</label>
            <Select
              value={selectedCalendarEdit}
              onValueChange={(val) => {
                setSelectedCalendarEdit(val);
                const [startYear, endYear] = val.split("-").map(Number);
                const startDate = getFirstSundayInMonth(startYear, 8);
                setFirstSundayEdit(startDate);

                const endDate = getLastSundayInMonth(Number(endYear), 5);
                setLastSundayEdit(endDate);
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Calendar" />
              </SelectTrigger>
              <SelectContent>
                {calendarOptions.map(opt => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedCalendarEdit && (
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block font-medium mb-1">Start Date</label>
                <DayPicker
                  mode="single"
                  selected={firstSundayEdit}
                  onSelect={setFirstSundayEdit}
                  defaultMonth={firstSundayEdit}
                  month={firstSundayEdit}
                  disabled={(date) =>
                    date.getDay() !== 0 ||
                    date < new Date(2024, 0, 1) ||
                    date > new Date(2030, 11, 31)
                  }
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">End Date</label>
                <DayPicker
                  mode="single"
                  selected={lastSundayEdit}
                  onSelect={setLastSundayEdit}
                  defaultMonth={lastSundayEdit}
                  month={lastSundayEdit}
                  disabled={(date) =>
                    date.getDay() !== 0 ||
                    date < new Date(2024, 0, 1) ||
                    date > new Date(2030, 11, 31)
                  }
                />
              </div>
            </div>
          )}
          <div>
            <Button type="submit" variant="destructive">
              Save Calendar
            </Button>
          </div>
        </form>
        <Dialog open={showEditConfirmDialog} onOpenChange={setShowEditConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Calendar Update</DialogTitle>
              <DialogDescription>
                This will update the calendar dates for {selectedCalendarEdit}. This action is destructive.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditConfirmDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmEdit}>
                Proceed
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <section className="mt-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Set Live Calendar</h2>
        <form onSubmit={handleLiveCalendarSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Live Calendar</label>
            <Select value={liveCalendar} onValueChange={setLiveCalendar}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Live Calendar" />
              </SelectTrigger>
              <SelectContent>
                {calendarOptions.map(opt => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button type="submit" variant="destructive">
              Update Live Calendar
            </Button>
          </div>
        </form>
        <Dialog open={showLiveConfirmDialog} onOpenChange={setShowLiveConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Live Calendar Update</DialogTitle>
              <DialogDescription>
                This will set {liveCalendar} as the live calendar. Are you sure?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLiveConfirmDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmLive}>
                Update Live Calendar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  )
}

