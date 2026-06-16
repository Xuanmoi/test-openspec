<script setup lang="ts">
import type { WorkoutRecord } from '~/types/fitness'

defineProps<{
  records: WorkoutRecord[]
}>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<template>
  <div class="masonry-feed">
    <div v-for="record in records" :key="record.id" class="masonry-item">
      <FeedCard :record="record" @click="emit('select', record.id)" />
    </div>
  </div>
</template>
