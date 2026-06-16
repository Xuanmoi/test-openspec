<script setup lang="ts">
import type { WorkoutRecord } from '~/types/fitness'
import { resolveDisplayTheme, timeOfDayLabel } from '~/utils/labels'

const props = defineProps<{
  record: WorkoutRecord
}>()

const emit = defineEmits<{
  click: []
}>()

const totalSets = computed(() =>
  props.record.groups.reduce((sum, group) => sum + group.sets.length, 0),
)

const title = computed(() => resolveDisplayTheme(props.record))

const summary = computed(() => `${props.record.groups.length} 个动作 · ${totalSets.value} 组`)
</script>

<template>
  <button type="button" class="app-card pressable w-full p-4 text-left" @click="emit('click')">
    <div class="flex gap-3">
      <div class="soft-gradient flex size-14 shrink-0 items-center justify-center rounded-[1.1rem] text-white shadow-lg shadow-blue-500/20">
        <UIcon name="i-lucide-dumbbell" class="size-6" />
      </div>
      <div class="min-w-0 flex-1">
        <div class="mb-1 flex items-center gap-2">
          <p class="truncate text-base font-bold text-slate-950 dark:text-white">
            {{ title }}
          </p>
          <span class="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            {{ timeOfDayLabel(record.timeOfDay) }}
          </span>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          {{ summary }}
        </p>
        <p class="mt-2 text-xs text-slate-400">
          {{ record.date }}
        </p>
      </div>
      <UIcon name="i-lucide-chevron-right" class="mt-1 size-5 shrink-0 text-slate-300" />
    </div>
  </button>
</template>
