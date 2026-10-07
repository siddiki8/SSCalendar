import type React from "react"
import { format } from "date-fns"

interface CalendarMonthsProps {
  sundaysByMonth: Record<string, Date[]>
  currentMonthRef?: React.Ref<HTMLElement>
  renderCard: (sunday: Date, dateString: string) => React.ReactNode
}

export default function CalendarMonths({ sundaysByMonth, currentMonthRef, renderCard }: CalendarMonthsProps) {
  const currentMonth = format(new Date(), "MMMM yyyy")

  return (
    <div className="space-y-10">
      {Object.entries(sundaysByMonth).map(([month, monthSundays]) => (
        <section
          key={month}
          ref={month === currentMonth ? currentMonthRef : undefined}
          aria-labelledby={`month-${month}`}
          className="scroll-mt-6"
        >
          <div className="mb-4 flex items-center gap-4">
            <h2 id={`month-${month}`} className="text-xl font-semibold text-brand dark:text-gold sm:text-2xl">
              {month}
            </h2>
            <div className="h-px flex-1 bg-gold/50" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {monthSundays.map((sunday) => {
              const dateString = sunday.toISOString().split("T")[0]
              return <div key={dateString}>{renderCard(sunday, dateString)}</div>
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
