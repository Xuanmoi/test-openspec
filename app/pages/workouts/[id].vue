<script setup lang="ts">
import type { WorkoutFormData } from '~/types/fitness'
import { formatDateTime } from '~/utils/date'
import { timeOfDayLabel } from '~/utils/labels'

const route = useRoute()
const router = useRouter()
const workoutStore = useWorkoutStore()

const id = computed(() => route.params.id as string)
const record = computed(() => workoutStore.getById(id.value))

const isEditing = ref(false)
const showDeleteModal = ref(false)

watchEffect(() => {
  if (!record.value) return
})

function handleUpdate(data: WorkoutFormData) {
  const result = workoutStore.update(id.value, data)
  if (result) {
    isEditing.value = false
  }
}

function handleDelete() {
  workoutStore.remove(id.value)
  router.push('/workouts')
}
</script>

<template>
  <div v-if="!record" class="text-center py-12">
    <UIcon name="i-lucide-file-question" class="mx-auto mb-2 size-10 text-gray-400" />
    <p class="text-gray-500">
      训练记录不存在
    </p>
    <UButton to="/workouts" class="mt-4" label="返回列表" />
  </div>

  <div v-else class="space-y-4">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold">
          {{ isEditing ? '编辑训练记录' : '训练详情' }}
        </h1>
        <p v-if="!isEditing" class="text-sm text-gray-500">
          {{ record.date }} · {{ timeOfDayLabel(record.timeOfDay) }}
        </p>
      </div>
      <div v-if="!isEditing" class="flex gap-2">
        <UButton variant="outline" icon="i-lucide-pencil" label="编辑" @click="isEditing = true" />
        <UButton color="error" variant="outline" icon="i-lucide-trash-2" label="删除" @click="showDeleteModal = true" />
      </div>
    </div>

    <UCard v-if="isEditing">
      <WorkoutForm
        :initial="{
          date: record.date,
          timeOfDay: record.timeOfDay,
          groups: record.groups,
        }"
        submit-label="保存修改"
        show-cancel
        @submit="handleUpdate"
        @cancel="isEditing = false"
      />
    </UCard>

    <template v-else>
      <UCard>
        <p class="text-xs text-gray-400">
          创建于 {{ formatDateTime(record.createdAt) }}
          <span v-if="record.updatedAt !== record.createdAt">
            · 更新于 {{ formatDateTime(record.updatedAt) }}
          </span>
        </p>
      </UCard>

      <div v-if="record.groups.length === 0" class="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500">
        该记录暂无训练大组
      </div>

      <UCard v-for="(group, index) in record.groups" :key="group.id">
        <h3 class="mb-3 font-semibold">
          {{ index + 1 }}. {{ group.exerciseName }}
        </h3>
        <div v-if="group.sets.length === 0" class="text-sm text-gray-400">
          暂无小组
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="set in group.sets"
            :key="set.id"
            class="flex flex-wrap gap-x-4 gap-y-1 text-sm"
          >
            <span>第 {{ set.setNumber }} 组</span>
            <span>{{ set.weight }} kg</span>
            <span v-if="set.notes" class="text-gray-500">{{ set.notes }}</span>
          </div>
        </div>
      </UCard>
    </template>

    <UModal v-model:open="showDeleteModal" title="确认删除">
      <template #body>
        <p>确定要删除这条训练记录吗？此操作不可撤销。</p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" label="取消" @click="showDeleteModal = false" />
          <UButton color="error" label="确认删除" @click="handleDelete" />
        </div>
      </template>
    </UModal>
  </div>
</template>
