import type { TimeOfDay } from '~/types/fitness'

export function todayDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function nowIso(): string {
  return new Date().toISOString()
}

export function guessTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('zh-CN')
}
