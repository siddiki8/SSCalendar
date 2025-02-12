import { PencilIcon } from "@heroicons/react/24/solid"
import { getIslamicDate } from "../utils/dateUtils"

interface EditableSundayCardProps {
  date: Date
  status?: "closed" | "event"
  message?: string
  messageColor?: string
  onEditClick: () => void
  isActive: boolean
}

export default function EditableSundayCard({
  date,
  status,
  message,
  messageColor,
  onEditClick,
  isActive,
}: EditableSundayCardProps) {
  const islamicDate = getIslamicDate(date)
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div
      className={`border rounded-lg min-h-[160px] flex flex-col bg-white relative
        ${isActive ? "ring-2 ring-blue-500" : ""}`}
    >
      <div
        className={`p-4 rounded-t-lg ${
          status === "closed" ? "bg-red-400" : status === "event" ? "bg-orange-400" : "bg-green-600"
        }`}
      >
        <button 
          onClick={onEditClick} 
          className="absolute top-2 right-2 text-white/80 hover:text-white"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
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

