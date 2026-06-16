import type { WorkoutRecord } from '~/types/fitness'

const GRADIENTS: [string, string][] = [
  ['#FF6B6B', '#FF8E53'],
  ['#FF2442', '#FF6B9D'],
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a18cd1', '#fbc2eb'],
  ['#ff9a56', '#ff6a88'],
  ['#30cfd0', '#330867'],
]

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function coverGradientFromText(text: string): { from: string, to: string, style: string } {
  const key = text.trim() || '训练记录'
  const [from, to] = GRADIENTS[hashString(key) % GRADIENTS.length]
  return {
    from,
    to,
    style: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
  }
}

export function getWorkoutCover(record: WorkoutRecord) {
  const firstName = record.groups.find(g => g.exerciseName.trim())?.exerciseName.trim()
  const label = firstName || '训练记录'
  const gradient = coverGradientFromText(label)
  return { label, ...gradient }
}

export function coverHeightFromId(id: string): number {
  const heights = [140, 160, 180, 200]
  return heights[hashString(id) % heights.length]
}
