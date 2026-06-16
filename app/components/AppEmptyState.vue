<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description?: string
  actionLabel?: string
  actionTo?: string
}>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="card-surface flex flex-col items-center px-6 py-10 text-center">
    <div class="mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40">
      <UIcon :name="icon" class="size-8 text-emerald-500" />
    </div>
    <h3 class="text-base font-semibold text-gray-900 dark:text-white">
      {{ title }}
    </h3>
    <p v-if="description" class="mt-2 max-w-xs text-sm text-gray-500 dark:text-gray-400">
      {{ description }}
    </p>
    <UButton
      v-if="actionLabel && actionTo"
      :to="actionTo"
      class="tap-feedback mt-5"
      size="lg"
      :label="actionLabel"
    />
    <UButton
      v-else-if="actionLabel"
      class="tap-feedback mt-5"
      size="lg"
      :label="actionLabel"
      @click="emit('action')"
    />
  </div>
</template>
