<script setup lang="ts">
import type { WorkoutFormData } from '~/types/fitness'

const toast = useToast()
const router = useRouter()
const workoutStore = useWorkoutStore()

function handleSubmit(data: WorkoutFormData) {
  workoutStore.create(data)
  toast.add({ title: '记录成功', description: '训练记录已保存', color: 'success' })
  router.push('/')
}
</script>

<template>
  <div class="space-y-4">
    <MobileTopBar back title="记录训练" subtitle="按步骤填写今天的训练内容" />
    <WorkoutForm submit-label="保存记录" @submit="handleSubmit" />
  </div>
</template>
