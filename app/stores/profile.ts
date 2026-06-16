import type { ProfileFormData, ProfileSnapshot } from '~/types/fitness'
import { generateId } from '~/utils/id'
import { nowIso } from '~/utils/date'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    snapshots: [] as ProfileSnapshot[],
  }),

  getters: {
    sortedSnapshots: (state): ProfileSnapshot[] =>
      [...state.snapshots].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
  },

  actions: {
    create(data: ProfileFormData): ProfileSnapshot {
      const now = nowIso()
      const snapshot: ProfileSnapshot = {
        id: generateId(),
        name: data.name.trim(),
        height: data.height!,
        weight: data.weight!,
        age: data.age ?? undefined,
        notes: data.notes?.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      }
      this.snapshots.push(snapshot)
      return snapshot
    },

    update(id: string, data: ProfileFormData): ProfileSnapshot | null {
      const index = this.snapshots.findIndex(s => s.id === id)
      if (index === -1) return null

      const updated: ProfileSnapshot = {
        ...this.snapshots[index],
        name: data.name.trim(),
        height: data.height!,
        weight: data.weight!,
        age: data.age ?? undefined,
        notes: data.notes?.trim() || undefined,
        updatedAt: nowIso(),
      }
      this.snapshots[index] = updated
      return updated
    },

    remove(id: string): boolean {
      const index = this.snapshots.findIndex(s => s.id === id)
      if (index === -1) return false
      this.snapshots.splice(index, 1)
      return true
    },

    getById(id: string): ProfileSnapshot | undefined {
      return this.snapshots.find(s => s.id === id)
    },
  },

  persist: true,
})
