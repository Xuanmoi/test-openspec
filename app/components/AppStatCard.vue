<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  unit?: string
  icon: string
  tone?: 'emerald' | 'blue' | 'amber'
}>()
</script>

<template>
  <div class="card-surface flex items-center gap-3 p-4">
    <div
      class="flex size-11 shrink-0 items-center justify-center rounded-xl"
      :class="{
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400': tone === 'emerald' || !tone,
        'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400': tone === 'blue',
        'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400': tone === 'amber',
      }"
    >
      <UIcon :name="icon" class="size-5" />
    </div>
    <div class="min-w-0">
      <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {{ label }}
      </p>
      <p class="mt-0.5 truncate text-xl font-bold text-gray-900 dark:text-white">
        {{ value }}<span v-if="unit" class="ml-1 text-sm font-medium text-gray-500">{{ unit }}</span>
      </p>
    </div>
  </div>
</template>
