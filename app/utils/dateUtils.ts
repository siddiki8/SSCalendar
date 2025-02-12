import { toHijri } from 'hijri-converter';
import { format, setDate, getDay, getYear, getDate, getMonth } from 'date-fns';

export function getSundays(year = new Date().getFullYear()) {
  const sundays = []
  const date = new Date(year, 0, 1) // January 1st of the given year

  // Go to the first Sunday of the year
  while (getDay(date) !== 0) {
    date.setDate(getDate(date) + 1)
  }

  // Add all Sundays of the year
  while (getYear(date) === year) {
    sundays.push(new Date(date))
    date.setDate(getDate(date) + 7)
  }

  return sundays
}

// New helper: Compute all Sundays between start and end dates (inclusive)
export function getSundaysBetween(start: Date, end: Date): Date[] {
  const sundays: Date[] = []
  const date = new Date(start)
  // Advance to the first Sunday if needed
  while (date.getDay() !== 0) {
    date.setDate(date.getDate() + 1)
  }
  while (date <= end) {
    sundays.push(new Date(date))
    date.setDate(date.getDate() + 7)
  }
  return sundays
}

export function getIslamicDate(date: Date): string {
  try {
    const { hy: year, hm: month, hd: day } = toHijri(
      getYear(date),
      getMonth(date) + 1, // getMonth is 0-based, toHijri expects 1-based
      getDate(date)
    );
    
    return `${day} ${getIslamicMonthName(month)} ${year} AH`;
  } catch (error) {
    console.error('Error converting to Hijri date:', error);
    return "Islamic Date Unavailable";
  }
}

function getIslamicMonthName(month: number): string {
  const months = [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaaban',
    'Ramadan', 'Shawwal', 'Dhu al-Qidah', 'Dhu al-Hijjah'
  ];
  return months[month - 1] || '';
}

// Bonus: Combined format helper
export function formatDates(date: Date): {
  gregorian: string;
  hijri: string;
} {
  return {
    gregorian: format(date, 'do MMMM yyyy'),
    hijri: getIslamicDate(date)
  };
}

