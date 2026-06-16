<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="mb-5 flex items-start justify-between gap-3">
    <div class="min-w-0">
      <h1 class="truncate text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ subtitle }}
      </p>
    </div>
    <div v-if="$slots.actions" class="shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>
