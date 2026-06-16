<script setup lang="ts">
const profileStore = useProfileStore()
const workoutStore = useWorkoutStore()

const latestProfile = computed(() => profileStore.sortedSnapshots[0])
const displayName = computed(() => latestProfile.value?.name || '健身达人')
const avatarLetter = computed(() => displayName.value.slice(0, 1))

const workoutCount = computed(() => workoutStore.records.length)
const currentWeight = computed(() => latestProfile.value?.weight ?? '—')
const recordDays = computed(() => {
  const dates = new Set(profileStore.snapshots.map(s => s.createdAt.slice(0, 10)))
  return dates.size
})
</script>

<template>
  <div class="-mx-3 mb-4 overflow-hidden bg-white dark:bg-gray-900">
    <div class="relative h-28 bg-gradient-to-r from-rose-400 via-rose-500 to-pink-500">
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px); background-size: 16px 16px;" />
    </div>

    <div class="relative px-4 pb-4">
      <div class="-mt-10 mb-3 flex items-end gap-3">
        <div class="flex size-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-rose-400 to-pink-500 text-2xl font-bold text-white shadow-md dark:border-gray-900">
          {{ avatarLetter }}
        </div>
        <div class="min-w-0 flex-1 pb-1">
          <h1 class="truncate text-lg font-bold text-gray-900 dark:text-white">
            {{ displayName }}
          </h1>
          <p class="text-xs text-gray-500">
            坚持记录，遇见更好的自己
          </p>
        </div>
      </div>

      <div class="grid grid-cols-3 divide-x divide-gray-100 rounded-xl bg-gray-50 py-3 dark:divide-gray-800 dark:bg-gray-800/50">
        <div class="text-center">
          <p class="text-lg font-bold text-gray-900 dark:text-white">
            {{ workoutCount }}
          </p>
          <p class="text-[11px] text-gray-500">
            训练
          </p>
        </div>
        <div class="text-center">
          <p class="text-lg font-bold text-gray-900 dark:text-white">
            {{ currentWeight }}<span v-if="currentWeight !== '—'" class="text-xs font-normal text-gray-400">kg</span>
          </p>
          <p class="text-[11px] text-gray-500">
            体重
          </p>
        </div>
        <div class="text-center">
          <p class="text-lg font-bold text-gray-900 dark:text-white">
            {{ recordDays }}
          </p>
          <p class="text-[11px] text-gray-500">
            记录天
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
