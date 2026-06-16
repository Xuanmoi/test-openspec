<script setup lang="ts">
import type { WorkoutFormData } from '~/types/fitness'

const toast = useToast()
const router = useRouter()
const workoutStore = useWorkoutStore()

const showMergeModal = ref(false)
const pendingData = ref<WorkoutFormData | null>(null)
const mergeTargetId = ref<string | null>(null)

const mergeTarget = computed(() =>
  mergeTargetId.value ? workoutStore.getById(mergeTargetId.value) : undefined,
)

function saveNewRecord(data: WorkoutFormData) {
  workoutStore.create(data)
  toast.add({ title: '记录成功', description: '训练记录已保存', color: 'success' })
  router.push('/')
}

function resetMergeState() {
  showMergeModal.value = false
  pendingData.value = null
  mergeTargetId.value = null
}

function handleSubmit(data: WorkoutFormData) {
  const latest = workoutStore.getLatestRecord()
  if (latest && workoutStore.isWithinMergeWindow(latest)) {
    pendingData.value = data
    mergeTargetId.value = latest.id
    showMergeModal.value = true
    return
  }
  saveNewRecord(data)
}

function handleMerge() {
  if (!pendingData.value || !mergeTargetId.value) return
  const result = workoutStore.appendGroups(
    mergeTargetId.value,
    pendingData.value.groups,
    pendingData.value.theme,
  )
  if (result) {
    toast.add({ title: '已归纳', description: '动作已合并到同一主题', color: 'success' })
    const targetId = mergeTargetId.value
    resetMergeState()
    router.push(`/workouts/${targetId}`)
  }
  else {
    toast.add({ title: '归纳失败', color: 'error' })
    resetMergeState()
  }
}

function handleSeparate() {
  if (!pendingData.value) return
  const data = pendingData.value
  resetMergeState()
  saveNewRecord(data)
}
</script>

<template>
  <div class="space-y-4">
    <MobileTopBar back title="记录训练" subtitle="按步骤填写今天的训练内容" />
    <WorkoutForm submit-label="保存记录" @submit="handleSubmit" />

    <AppMergeSessionModal
      v-if="mergeTarget"
      v-model:open="showMergeModal"
      :target-record="mergeTarget"
      @merge="handleMerge"
      @separate="handleSeparate"
    />
  </div>
</template>
