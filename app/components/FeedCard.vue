<script setup lang="ts">
import type { WorkoutRecord } from '~/types/fitness'
import { coverHeightFromId, getWorkoutCover } from '~/utils/cover'
import { timeOfDayLabel } from '~/utils/labels'

const props = defineProps<{
  record: WorkoutRecord
}>()

const emit = defineEmits<{
  click: []
}>()

const cover = computed(() => getWorkoutCover(props.record))
const coverHeight = computed(() => coverHeightFromId(props.record.id))

const title = computed(() => `${timeOfDayLabel(props.record.timeOfDay)}训练`)

const totalSets = computed(() =>
  props.record.groups.reduce((sum, g) => sum + g.sets.length, 0),
)

const tags = computed(() =>
  props.record.groups
    .map(g => g.exerciseName.trim())
    .filter(Boolean)
    .slice(0, 3),
)

const dateLabel = computed(() => {
  const d = props.record.date
  return d.length >= 10 ? d.slice(5).replace('-', '/') : d
})
</script>

<template>
  <article
    class="note-card tap-feedback w-full cursor-pointer text-left"
    @click="emit('click')"
  >
    <div
      class="relative flex items-end p-3"
      :style="{ background: cover.style, height: `${coverHeight}px` }"
    >
      <div class="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      <div class="relative z-10 w-full">
        <div v-if="tags.length" class="mb-2 flex flex-wrap gap-1">
          <span
            v-for="tag in tags"
            :key="tag"
            class="rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
          >
            {{ tag }}
          </span>
        </div>
        <p class="line-clamp-2 text-sm font-bold leading-snug text-white drop-shadow">
          {{ cover.label }}
        </p>
      </div>
    </div>
    <div class="space-y-1 p-2.5">
      <h3 class="line-clamp-2 text-[13px] font-semibold leading-snug text-gray-900 dark:text-white">
        {{ title }}
      </h3>
      <p class="text-[11px] text-gray-500">
        {{ record.groups.length }} 动作 · {{ totalSets }} 组
      </p>
      <p class="text-[10px] text-gray-400">
        {{ dateLabel }}
      </p>
    </div>
  </article>
</template>
