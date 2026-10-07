import { PencilIcon } from "@heroicons/react/24/solid"
import { format } from "date-fns"
import SundayCard, { type SundayStatus } from "./SundayCard"

interface EditableSundayCardProps {
  date: Date
  status?: SundayStatus
  message?: string
  messageColor?: string
  onEditClick: () => void
  isActive: boolean
}

export default function EditableSundayCard({ onEditClick, ...props }: EditableSundayCardProps) {
  return (
    <SundayCard
      {...props}
      action={
        <button
          onClick={onEditClick}
          aria-label={`Edit ${format(props.date, "MMMM d, yyyy")}`}
          className="rounded-md p-1 opacity-80 hover:bg-black/10 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
      }
    />
  )
}
