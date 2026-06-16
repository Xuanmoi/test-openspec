import type { ExerciseGroup, TimeOfDay, WorkoutFormData, WorkoutRecord } from '~/types/fitness'
import { MERGE_WINDOW_MS } from '~/utils/labels'
import { generateId } from '~/utils/id'
import { nowIso } from '~/utils/date'

function normalizeTheme(theme?: string): string | undefined {
  const trimmed = theme?.trim()
  return trimmed || undefined
}

export const useWorkoutStore = defineStore('workout', {
  state: () => ({
    records: [] as WorkoutRecord[],
  }),

  getters: {
    sortedRecords: (state): WorkoutRecord[] =>
      [...state.records].sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date)
        if (dateCompare !== 0) return dateCompare
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }),
  },

  actions: {
    create(data: WorkoutFormData): WorkoutRecord {
      const now = nowIso()
      const record: WorkoutRecord = {
        id: generateId(),
        date: data.date,
        timeOfDay: data.timeOfDay as TimeOfDay,
        theme: normalizeTheme(data.theme),
        groups: data.groups,
        createdAt: now,
        updatedAt: now,
      }
      this.records.push(record)
      return record
    },

    update(id: string, data: WorkoutFormData): WorkoutRecord | null {
      const index = this.records.findIndex(r => r.id === id)
      if (index === -1) return null

      const updated: WorkoutRecord = {
        ...this.records[index],
        date: data.date,
        timeOfDay: data.timeOfDay as TimeOfDay,
        theme: normalizeTheme(data.theme),
        groups: data.groups,
        updatedAt: nowIso(),
      }
      this.records[index] = updated
      return updated
    },

    remove(id: string): boolean {
      const index = this.records.findIndex(r => r.id === id)
      if (index === -1) return false
      this.records.splice(index, 1)
      return true
    },

    getById(id: string): WorkoutRecord | undefined {
      return this.records.find(r => r.id === id)
    },

    getLatestRecord(): WorkoutRecord | undefined {
      if (this.records.length === 0) return undefined
      return [...this.records].sort((a, b) => {
        const aTime = new Date(a.updatedAt || a.createdAt).getTime()
        const bTime = new Date(b.updatedAt || b.createdAt).getTime()
        return bTime - aTime
      })[0]
    },

    isWithinMergeWindow(record: WorkoutRecord): boolean {
      const lastActive = new Date(record.updatedAt || record.createdAt).getTime()
      return Date.now() - lastActive < MERGE_WINDOW_MS
    },

    appendGroups(id: string, groups: ExerciseGroup[], theme?: string): WorkoutRecord | null {
      const index = this.records.findIndex(r => r.id === id)
      if (index === -1) return null

      const record = this.records[index]
      const updated: WorkoutRecord = {
        ...record,
        groups: [...record.groups, ...groups],
        theme: normalizeTheme(record.theme) || normalizeTheme(theme),
        updatedAt: nowIso(),
      }
      this.records[index] = updated
      return updated
    },

    createEmptyGroup(): ExerciseGroup {
      return {
        id: generateId(),
        exerciseName: '',
        sets: [1, 2, 3, 4].map(n => this.createEmptySet(n)),
      }
    },

    createEmptySet(setNumber = 1) {
      return {
        id: generateId(),
        setNumber,
        weight: 0,
      }
    },
  },

  persist: true,
})
