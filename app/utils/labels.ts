import type { TimeOfDay } from '~/types/fitness'

export const TIME_OF_DAY_OPTIONS: { label: string, value: TimeOfDay }[] = [
  { label: '上午', value: 'morning' },
  { label: '下午', value: 'afternoon' },
  { label: '晚上', value: 'evening' },
]

export function timeOfDayLabel(value: TimeOfDay): string {
  return TIME_OF_DAY_OPTIONS.find(o => o.value === value)?.label ?? value
}
