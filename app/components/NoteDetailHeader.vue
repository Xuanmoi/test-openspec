<script setup lang="ts">
import type { WorkoutRecord } from '~/types/fitness'
import { formatDateTime } from '~/utils/date'
import { getWorkoutCover } from '~/utils/cover'
import { timeOfDayLabel } from '~/utils/labels'

const props = defineProps<{
  record: WorkoutRecord
}>()

const cover = computed(() => getWorkoutCover(props.record))
const title = computed(() => `${props.record.date} · ${timeOfDayLabel(props.record.timeOfDay)}训练`)

const totalSets = computed(() =>
  props.record.groups.reduce((sum, g) => sum + g.sets.length, 0),
)
</script>

<template>
  <header class="-mx-3 overflow-hidden">
    <div
      class="relative flex h-48 flex-col justify-end p-5"
      :style="{ background: cover.style }"
    >
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      <div class="relative z-10">
        <div class="mb-2 flex flex-wrap gap-1.5">
          <span
            v-for="group in record.groups.filter(g => g.exerciseName.trim()).slice(0, 4)"
            :key="group.id"
            class="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
          >
            {{ group.exerciseName }}
          </span>
        </div>
        <h1 class="text-xl font-bold text-white drop-shadow-sm">
          {{ title }}
        </h1>
        <p class="mt-1 text-sm text-white/80">
          {{ record.groups.length }} 动作 · {{ totalSets }} 组
        </p>
      </div>
    </div>
    <div class="bg-white px-4 py-3 dark:bg-gray-900">
      <p class="text-xs text-gray-400">
        发布于 {{ formatDateTime(record.createdAt) }}
      </p>
    </div>
  </header>
</template>
