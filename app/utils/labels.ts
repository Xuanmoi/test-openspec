import type { TimeOfDay, WorkoutRecord } from '~/types/fitness'

export const TIME_OF_DAY_OPTIONS: { label: string, value: TimeOfDay }[] = [
  { label: '上午', value: 'morning' },
  { label: '下午', value: 'afternoon' },
  { label: '晚上', value: 'evening' },
]

export const WORKOUT_THEME_PRESETS = ['臀腿', '背', '胸肩', '核心'] as const

export const MERGE_WINDOW_MS = 60 * 60 * 1000

export function timeOfDayLabel(value: TimeOfDay): string {
  return TIME_OF_DAY_OPTIONS.find(o => o.value === value)?.label ?? value
}

export function resolveDisplayTheme(record: Pick<WorkoutRecord, 'theme' | 'groups'>): string {
  const theme = record.theme?.trim()
  if (theme) return theme
  const first = record.groups.find(group => group.exerciseName.trim())?.exerciseName.trim()
  return first || '训练记录'
}

export function formatMinutesSince(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return '刚刚'
  return `${mins} 分钟前`
}
