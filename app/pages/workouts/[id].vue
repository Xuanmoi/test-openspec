<script setup lang="ts">
import type { WorkoutFormData } from '~/types/fitness'
import { formatDateTime } from '~/utils/date'
import { timeOfDayLabel } from '~/utils/labels'

const toast = useToast()
const route = useRoute()
const router = useRouter()
const workoutStore = useWorkoutStore()

const id = computed(() => route.params.id as string)
const record = computed(() => workoutStore.getById(id.value))

const isEditing = ref(false)
const showDeleteModal = ref(false)

function handleUpdate(data: WorkoutFormData) {
  const result = workoutStore.update(id.value, data)
  if (result) {
    isEditing.value = false
    toast.add({ title: '已更新', color: 'success' })
  }
  else {
    toast.add({ title: '更新失败', color: 'error' })
  }
}

function handleDelete() {
  workoutStore.remove(id.value)
  toast.add({ title: '已删除', color: 'success' })
  router.push('/')
}
</script>

<template>
  <div v-if="!record" class="app-card px-6 py-12 text-center">
    <UIcon name="i-lucide-file-question" class="mx-auto mb-2 size-10 text-gray-300" />
    <p class="font-bold text-gray-950 dark:text-white">
      记录不存在
    </p>
    <p class="mt-1 text-sm text-gray-500">
      这条训练可能已经被删除
    </p>
    <UButton to="/" class="pressable mt-4" color="primary" label="返回今日" />
  </div>

  <div v-else :class="isEditing ? '' : 'pb-[calc(var(--app-action-bar-height)+1rem)]'">
    <template v-if="isEditing">
      <MobileTopBar back title="编辑训练" subtitle="调整训练内容后保存" />
      <WorkoutForm
        :initial="{ date: record.date, timeOfDay: record.timeOfDay, groups: record.groups }"
        submit-label="保存修改"
        show-cancel
        @submit="handleUpdate"
        @cancel="isEditing = false"
      />
    </template>

    <template v-else>
      <MobileTopBar back title="训练详情" :subtitle="`${record.date} · ${timeOfDayLabel(record.timeOfDay)}`" />

      <section class="soft-gradient mb-4 rounded-[1.6rem] p-5 text-white shadow-2xl shadow-blue-500/20">
        <p class="text-sm font-semibold text-white/75">
          {{ timeOfDayLabel(record.timeOfDay) }}训练
        </p>
        <h1 class="mt-2 text-3xl font-black tracking-tight">
          {{ record.groups[0]?.exerciseName || '训练记录' }}
        </h1>
        <p class="mt-2 text-sm text-white/80">
          {{ record.groups.length }} 个动作 · 创建于 {{ formatDateTime(record.createdAt) }}
        </p>
      </section>

      <article class="space-y-3">
        <SectionCard v-if="record.groups.length === 0" title="训练内容" icon="i-lucide-list">
          <p class="text-center text-sm text-gray-400">
            暂无训练内容
          </p>
        </SectionCard>

        <SectionCard
          v-for="(group, index) in record.groups"
          :key="group.id"
          :title="group.exerciseName || `动作 ${index + 1}`"
          :subtitle="`${group.sets.length} 个小组`"
          icon="i-lucide-dumbbell"
        >
          <div class="space-y-2">
            <div
              v-for="set in group.sets"
              :key="set.id"
              class="flex items-center gap-3 rounded-2xl bg-gray-50 px-3 py-3 text-sm dark:bg-gray-950/40"
            >
              <span class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-black text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-200">
                {{ set.setNumber }}
              </span>
              <span class="font-bold text-gray-950 dark:text-white">{{ set.weight }} kg</span>
              <span v-if="set.notes" class="min-w-0 flex-1 truncate text-xs text-gray-500">{{ set.notes }}</span>
            </div>
            <p v-if="group.sets.length === 0" class="text-sm text-gray-400">
              暂无小组记录
            </p>
          </div>
        </SectionCard>
      </article>

      <MobileActionBar
        submit-label="编辑记录"
        cancel-label="删除"
        show-cancel
        @submit="isEditing = true"
        @cancel="showDeleteModal = true"
      />
    </template>

    <AppDeleteModal
      v-model:open="showDeleteModal"
      message="确定要删除这条训练记录吗？此操作不可撤销。"
      @confirm="handleDelete"
    />
  </div>
</template>
