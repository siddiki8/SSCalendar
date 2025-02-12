import { getIslamicDate } from "../utils/dateUtils"

interface SundayCardProps {
  date: Date
  status?: "closed" | "event"
  message?: string
  messageColor?: string
}

export default function SundayCard({ date, status, message, messageColor }: SundayCardProps) {
  const islamicDate = getIslamicDate(date)
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div
      className="border rounded-lg min-h-[160px] flex flex-col bg-white overflow-hidden"
    >
      <div
        className={`p-4 ${
          status === "closed" ? "bg-red-400" : status === "event" ? "bg-orange-400" : "bg-green-600"
        }`}
      >
        <p className="font-bold text-white">{formattedDate}</p>
        <p className="text-sm text-white/80">{islamicDate}</p>
      </div>
      <div className="h-px bg-gray-200 w-full" />
      {message && (
        <p 
          className="flex-1 p-4 text-base font-semibold text-center flex items-center justify-center"
          style={{ color: messageColor }}
        >
          {message}
        </p>
      )}
      {!message && (
        <div className="flex-1" />
      )}
    </div>
  )
}

