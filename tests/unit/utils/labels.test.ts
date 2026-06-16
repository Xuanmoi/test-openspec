import { describe, expect, it, vi, afterEach } from 'vitest'
import { formatMinutesSince, resolveDisplayTheme } from '~/utils/labels'
import type { WorkoutRecord } from '~/types/fitness'

function minimalRecord(overrides: Partial<WorkoutRecord> = {}): WorkoutRecord {
  return {
    id: 'r1',
    date: '2026-06-16',
    timeOfDay: 'morning',
    groups: [],
    createdAt: '2026-06-16T10:00:00.000Z',
    updatedAt: '2026-06-16T10:00:00.000Z',
    ...overrides,
  }
}

describe('resolveDisplayTheme', () => {
  it('returns explicit theme when set', () => {
    const record = minimalRecord({ theme: '臀腿' })
    expect(resolveDisplayTheme(record)).toBe('臀腿')
  })

  it('falls back to first exercise name when theme is empty', () => {
    const record = minimalRecord({
      groups: [{ id: 'g1', exerciseName: '深蹲', sets: [] }],
    })
    expect(resolveDisplayTheme(record)).toBe('深蹲')
  })

  it('returns placeholder when no theme and no exercise name', () => {
    expect(resolveDisplayTheme(minimalRecord())).toBe('训练记录')
  })
})

describe('formatMinutesSince', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns 刚刚 for less than one minute', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-16T10:00:30.000Z'))
    expect(formatMinutesSince('2026-06-16T10:00:00.000Z')).toBe('刚刚')
  })

  it('returns minutes ago for longer gaps', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-16T10:15:00.000Z'))
    expect(formatMinutesSince('2026-06-16T10:00:00.000Z')).toBe('15 分钟前')
  })
})
