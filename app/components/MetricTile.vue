<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  unit?: string
  icon: string
  muted?: boolean
}>()
</script>

<template>
  <div class="app-card pressable p-3.5">
    <div class="mb-3 flex items-center justify-between">
      <span class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ label }}</span>
      <UIcon :name="icon" class="size-4.5" :class="muted ? 'text-slate-300' : 'text-blue-500'" />
    </div>
    <p class="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
      {{ value }}<span v-if="unit" class="ml-1 text-xs font-semibold text-slate-400">{{ unit }}</span>
    </p>
  </div>
</template>
