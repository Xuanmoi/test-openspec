<script setup lang="ts">
import { timeOfDayLabel } from '~/utils/labels'

const workoutStore = useWorkoutStore()
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        训练记录
      </h1>
      <UButton to="/workouts/new" icon="i-lucide-plus" label="新建" />
    </div>

    <div v-if="workoutStore.sortedRecords.length === 0" class="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-700">
      <UIcon name="i-lucide-dumbbell" class="mx-auto mb-2 size-8 opacity-50" />
      <p>暂无训练记录</p>
      <p class="mt-1 text-sm">
        点击「新建」开始记录今天的训练
      </p>
      <UButton to="/workouts/new" class="mt-4" label="新建训练记录" />
    </div>

    <div v-else class="space-y-3">
      <UCard
        v-for="record in workoutStore.sortedRecords"
        :key="record.id"
        class="cursor-pointer transition hover:ring-2 hover:ring-primary/30"
        @click="navigateTo(`/workouts/${record.id}`)"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">
              {{ record.date }} · {{ timeOfDayLabel(record.timeOfDay) }}
            </p>
            <p class="text-sm text-gray-500">
              {{ record.groups.length }} 个大组
              · {{ record.groups.reduce((sum, g) => sum + g.sets.length, 0) }} 个小组
            </p>
          </div>
          <UIcon name="i-lucide-chevron-right" class="size-5 text-gray-400" />
        </div>
      </UCard>
    </div>
  </div>
</template>
