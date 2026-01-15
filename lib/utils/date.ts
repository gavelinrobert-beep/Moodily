import { format, parseISO, startOfWeek, endOfWeek, subWeeks, startOfDay, endOfDay } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function formatDate(date: Date | string, formatStr: string = 'yyyy-MM-dd'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function getThisWeekRange(timezone: string = getUserTimezone()) {
  const now = new Date()
  const zonedNow = utcToZonedTime(now, timezone)
  
  return {
    start: startOfWeek(zonedNow, { weekStartsOn: 1 }),
    end: endOfWeek(zonedNow, { weekStartsOn: 1 })
  }
}

export function getLastWeekRange(timezone: string = getUserTimezone()) {
  const now = new Date()
  const zonedNow = utcToZonedTime(now, timezone)
  const lastWeek = subWeeks(zonedNow, 1)
  
  return {
    start: startOfWeek(lastWeek, { weekStartsOn: 1 }),
    end: endOfWeek(lastWeek, { weekStartsOn: 1 })
  }
}

export function getTodayRange(timezone: string = getUserTimezone()) {
  const now = new Date()
  const zonedNow = utcToZonedTime(now, timezone)
  
  return {
    start: startOfDay(zonedNow),
    end: endOfDay(zonedNow)
  }
}
