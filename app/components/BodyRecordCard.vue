<script setup lang="ts">
import type { ProfileSnapshot } from '~/types/fitness'
import { formatDateTime } from '~/utils/date'

defineProps<{
  snapshot: ProfileSnapshot
}>()

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()
</script>

<template>
  <article class="app-card p-4">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-lg font-black text-slate-950 dark:text-white">
          {{ snapshot.weight }}<span class="ml-1 text-xs font-semibold text-slate-400">kg</span>
        </p>
        <p class="mt-1 text-sm text-slate-500">
          身高 {{ snapshot.height }} cm
          <span v-if="snapshot.age"> · {{ snapshot.age }} 岁</span>
        </p>
        <p v-if="snapshot.notes" class="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
          {{ snapshot.notes }}
        </p>
        <p class="mt-2 text-xs text-slate-400">
          {{ formatDateTime(snapshot.createdAt) }}
        </p>
      </div>
      <div class="flex shrink-0 gap-1">
        <UButton class="pressable tap-target" size="xs" color="primary" variant="soft" icon="i-lucide-pencil" @click="emit('edit', snapshot.id)" />
        <UButton class="pressable tap-target" size="xs" color="error" variant="soft" icon="i-lucide-trash-2" @click="emit('delete', snapshot.id)" />
      </div>
    </div>
  </article>
</template>
