<script setup lang="ts">
import type { WorkoutFormData } from '~/types/fitness'

const workoutStore = useWorkoutStore()
const router = useRouter()

function handleSubmit(data: WorkoutFormData) {
  workoutStore.create(data)
  router.push('/workouts')
}
</script>

<template>
  <div>
    <h1 class="mb-4 text-2xl font-bold">
      新建训练记录
    </h1>
    <UCard>
      <WorkoutForm submit-label="保存训练记录" @submit="handleSubmit" />
    </UCard>
  </div>
</template>
