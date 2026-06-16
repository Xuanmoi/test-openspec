<script setup lang="ts">
import { timeOfDayLabel } from '~/utils/labels'

const profileStore = useProfileStore()
const workoutStore = useWorkoutStore()

const records = computed(() => workoutStore.sortedRecords)
const latestProfile = computed(() => profileStore.sortedSnapshots[0])
const latestWorkout = computed(() => records.value[0])

const thisMonthCount = computed(() => {
  const now = new Date()
  const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return workoutStore.records.filter(record => record.date.startsWith(prefix)).length
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
})
</script>

<template>
  <div class="space-y-5">
    <MobileTopBar title="今日" :subtitle="`${greeting}，准备好训练了吗？`">
      <template #actions>
        <UButton to="/workouts" class="pressable" size="sm" variant="soft" icon="i-lucide-history" />
      </template>
    </MobileTopBar>

    <section class="soft-gradient overflow-hidden rounded-[1.6rem] p-5 text-white shadow-2xl shadow-blue-500/20">
      <p class="text-sm font-semibold text-white/75">
        今日状态
      </p>
      <h2 class="mt-2 text-3xl font-black tracking-tight">
        开始记录你的下一组
      </h2>
      <p class="mt-2 max-w-[16rem] text-sm leading-relaxed text-white/80">
        每次训练都算数，保持节奏比追求完美更重要。
      </p>
      <UButton
        to="/workouts/new"
        class="pressable mt-5 bg-white text-blue-600 hover:bg-white/90"
        size="lg"
        icon="i-lucide-plus"
        label="立即记录"
      />
    </section>

    <section class="grid grid-cols-3 gap-3">
      <MetricTile label="累计" :value="records.length" unit="次" icon="i-lucide-trophy" />
      <MetricTile label="本月" :value="thisMonthCount" unit="次" icon="i-lucide-calendar-check" />
      <MetricTile label="体重" :value="latestProfile?.weight ?? '—'" unit="kg" icon="i-lucide-scale" />
    </section>

    <SectionCard title="最近训练" subtitle="快速回看上一条记录" icon="i-lucide-dumbbell">
      <template #actions>
        <UButton v-if="records.length > 0" to="/workouts" size="xs" variant="ghost" label="全部" />
      </template>

      <WorkoutPreviewCard
        v-if="latestWorkout"
        :record="latestWorkout"
        @click="navigateTo(`/workouts/${latestWorkout.id}`)"
      />

      <div v-else class="rounded-[1.2rem] border border-dashed border-gray-200 p-6 text-center dark:border-gray-800">
        <div class="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40">
          <UIcon name="i-lucide-dumbbell" class="size-7" />
        </div>
        <p class="font-bold text-gray-950 dark:text-white">
          暂无训练记录
        </p>
        <p class="mt-1 text-sm text-gray-500">
          点击下方记录按钮开始第一次训练
        </p>
      </div>
    </SectionCard>

    <SectionCard v-if="latestWorkout" title="训练摘要" icon="i-lucide-activity">
      <div class="space-y-3">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500">最近时段</span>
          <span class="font-bold text-gray-900 dark:text-white">{{ timeOfDayLabel(latestWorkout.timeOfDay) }}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500">训练日期</span>
          <span class="font-bold text-gray-900 dark:text-white">{{ latestWorkout.date }}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-500">动作数量</span>
          <span class="font-bold text-gray-900 dark:text-white">{{ latestWorkout.groups.length }}</span>
        </div>
      </div>
    </SectionCard>
  </div>
</template>
