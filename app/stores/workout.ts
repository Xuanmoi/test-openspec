import type { ExerciseGroup, TimeOfDay, WorkoutFormData, WorkoutRecord } from '~/types/fitness'
import { generateId } from '~/utils/id'
import { nowIso } from '~/utils/date'

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

    createEmptyGroup(): ExerciseGroup {
      return {
        id: generateId(),
        exerciseName: '',
        sets: [],
      }
    },

    createEmptySet() {
      return {
        id: generateId(),
        setNumber: 1,
        weight: 0,
        notes: '',
      }
    },
  },

  persist: true,
})
