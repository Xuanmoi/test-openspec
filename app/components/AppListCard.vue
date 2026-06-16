<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  icon?: string
  meta?: string
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    class="card-surface tap-feedback w-full p-4 text-left transition hover:shadow-md hover:ring-1 hover:ring-emerald-500/20"
    @click="emit('click')"
  >
    <div class="flex items-center gap-3">
      <div
        v-if="icon"
        class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
      >
        <UIcon :name="icon" class="size-5" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="truncate font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </p>
        <p v-if="subtitle" class="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
          {{ subtitle }}
        </p>
        <p v-if="meta" class="mt-1 text-xs text-gray-400">
          {{ meta }}
        </p>
      </div>
      <UIcon name="i-lucide-chevron-right" class="size-5 shrink-0 text-gray-300 dark:text-gray-600" />
    </div>
  </button>
</template>
