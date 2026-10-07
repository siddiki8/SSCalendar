import { format } from "date-fns"
import { getIslamicDate } from "../utils/dateUtils"

interface CalendarHeroProps {
  schoolYear?: string
}

const legend = [
  { label: "Class", swatch: "bg-brand ring-1 ring-white/40" },
  { label: "Event", swatch: "bg-gold" },
  { label: "Closed", swatch: "bg-brick" },
]

export default function CalendarHero({ schoolYear }: CalendarHeroProps) {
  const today = new Date()

  return (
    <section className="bg-brand text-white dark:bg-brand-deep">
      <div className="container mx-auto px-4 py-10 text-center sm:py-12">
        <h1 className="text-3xl font-semibold uppercase tracking-wide sm:text-4xl">Sunday School Calendar</h1>
        <p className="mt-3 text-sm text-white/80">
          {schoolYear && <span className="font-semibold text-gold">{schoolYear} School Year · </span>}
          {format(today, "EEEE, MMM d")} | {getIslamicDate(today)}
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm" aria-label="Legend">
          {legend.map(({ label, swatch }) => (
            <li key={label} className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${swatch}`} aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
