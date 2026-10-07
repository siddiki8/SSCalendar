"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { doc, setDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { getIslamicDate } from "../utils/dateUtils"

interface EditSundayModalProps {
  date: Date
  onClose: () => void
  initialData: {
    status?: "normal" | "closed" | "event"
    message?: string
    messageColor?: string
  }
}

const colorOptions = [
  { value: "#000000", label: "Default" }, // follows the card text color
  { value: "#dc2626", label: "Red" },     // text-red-600
  { value: "#ea580c", label: "Orange" },  // text-orange-600
  { value: "#16a34a", label: "Green" },   // text-green-600
  { value: "#2563eb", label: "Blue" },    // text-blue-600
  { value: "#7c3aed", label: "Violet" },  // text-violet-600
]

export default function EditSundayModal({ date, onClose, initialData }: EditSundayModalProps) {
  const [status, setStatus] = useState<"normal" | "closed" | "event">(initialData.status || "normal")
  const [message, setMessage] = useState(initialData.message || "")
  const [messageColor, setMessageColor] = useState(initialData.messageColor || "#000000")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const dateString = date.toISOString().split("T")[0]
    
    try {
      await setDoc(doc(db, "sundays", dateString), {
        status,
        message,
        messageColor,
      }, { merge: true })
      
      onClose()
    } catch (error) {
      console.error("Error updating Sunday:", error)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </DialogTitle>
          <DialogDescription>{getIslamicDate(date)}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: "normal" | "closed" | "event") => setStatus(value)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="messageColor">Message Color</Label>
            <Select value={messageColor} onValueChange={setMessageColor}>
              <SelectTrigger id="messageColor">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <span 
                      className="inline-block w-4 h-4 rounded-full mr-2 ring-1 ring-border" 
                      style={{ backgroundColor: color.value }}
                    ></span>
                    {color.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

