<script setup lang="ts">
import type { WorkoutRecord } from '~/types/fitness'

const workoutStore = useWorkoutStore()

const records = computed(() => workoutStore.sortedRecords)

const groupedRecords = computed(() => {
  const groups = new Map<string, WorkoutRecord[]>()
  for (const record of records.value) {
    const list = groups.get(record.date) ?? []
    list.push(record)
    groups.set(record.date, list)
  }
  return [...groups.entries()].map(([date, items]) => ({ date, items }))
})
</script>

<template>
  <div class="space-y-4">
    <MobileTopBar back title="训练历史" :subtitle="`${records.length} 条记录`" />

    <div v-if="records.length === 0" class="app-card px-6 py-12 text-center">
      <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40">
        <UIcon name="i-lucide-dumbbell" class="size-8" />
      </div>
      <p class="font-bold text-gray-950 dark:text-white">
        还没有训练记录
      </p>
      <p class="mt-1 text-sm text-gray-500">
        从一次简单训练开始
      </p>
      <UButton to="/workouts/new" class="pressable mt-5" color="primary" label="开始记录" />
    </div>

    <section v-for="group in groupedRecords" v-else :key="group.date" class="space-y-3">
      <h2 class="px-1 text-sm font-black text-gray-500">
        {{ group.date }}
      </h2>
      <WorkoutPreviewCard
        v-for="record in group.items"
        :key="record.id"
        :record="record"
        @click="navigateTo(`/workouts/${record.id}`)"
      />
    </section>
  </div>
</template>
