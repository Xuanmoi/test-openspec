import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MERGE_WINDOW_MS } from '~/utils/labels'
import { useWorkoutStore } from '~/stores/workout'
import type { ExerciseGroup } from '~/types/fitness'

function sampleGroup(name: string): ExerciseGroup {
  return {
    id: `g-${name}`,
    exerciseName: name,
    sets: [{ id: 's1', setNumber: 1, weight: 50, reps: 10 }],
  }
}

describe('useWorkoutStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-16T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('persists theme on create (trimmed)', () => {
    const store = useWorkoutStore()
    const record = store.create({
      date: '2026-06-16',
      timeOfDay: 'morning',
      theme: '  臀腿  ',
      groups: [sampleGroup('深蹲')],
    })
    expect(record.theme).toBe('臀腿')
  })

  it('stores undefined theme when blank', () => {
    const store = useWorkoutStore()
    const record = store.create({
      date: '2026-06-16',
      timeOfDay: 'morning',
      theme: '   ',
      groups: [sampleGroup('深蹲')],
    })
    expect(record.theme).toBeUndefined()
  })

  it('getLatestRecord returns most recently updated record', () => {
    const store = useWorkoutStore()
    store.create({
      date: '2026-06-16',
      timeOfDay: 'morning',
      groups: [sampleGroup('A')],
    })
    vi.advanceTimersByTime(1000)
    const newer = store.create({
      date: '2026-06-16',
      timeOfDay: 'afternoon',
      groups: [sampleGroup('B')],
    })
    expect(store.getLatestRecord()?.id).toBe(newer.id)
  })

  it('isWithinMergeWindow is true inside one hour', () => {
    const store = useWorkoutStore()
    const record = store.create({
      date: '2026-06-16',
      timeOfDay: 'morning',
      groups: [sampleGroup('深蹲')],
    })
    vi.advanceTimersByTime(MERGE_WINDOW_MS - 1000)
    expect(store.isWithinMergeWindow(record)).toBe(true)
  })

  it('isWithinMergeWindow is false after one hour', () => {
    const store = useWorkoutStore()
    const record = store.create({
      date: '2026-06-16',
      timeOfDay: 'morning',
      groups: [sampleGroup('深蹲')],
    })
    vi.advanceTimersByTime(MERGE_WINDOW_MS)
    expect(store.isWithinMergeWindow(record)).toBe(false)
  })

  it('appendGroups merges groups and fills theme when target has none', () => {
    const store = useWorkoutStore()
    const record = store.create({
      date: '2026-06-16',
      timeOfDay: 'morning',
      groups: [sampleGroup('深蹲')],
    })
    const extra = sampleGroup('硬拉')
    const updated = store.appendGroups(record.id, [extra], '背')
    expect(updated?.groups).toHaveLength(2)
    expect(updated?.theme).toBe('背')
    expect(updated?.groups[1].exerciseName).toBe('硬拉')
  })

  it('appendGroups keeps existing theme over incoming theme', () => {
    const store = useWorkoutStore()
    const record = store.create({
      date: '2026-06-16',
      timeOfDay: 'morning',
      theme: '臀腿',
      groups: [sampleGroup('深蹲')],
    })
    const updated = store.appendGroups(record.id, [sampleGroup('硬拉')], '背')
    expect(updated?.theme).toBe('臀腿')
  })

  it('createEmptyGroup defaults to four sets', () => {
    const store = useWorkoutStore()
    const group = store.createEmptyGroup()
    expect(group.sets).toHaveLength(4)
    expect(group.sets.map(s => s.setNumber)).toEqual([1, 2, 3, 4])
  })
})
