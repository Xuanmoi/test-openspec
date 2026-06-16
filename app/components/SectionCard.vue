<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  icon?: string
}>()
</script>

<template>
  <section class="app-card p-4">
    <div v-if="title || $slots.actions" class="mb-4 flex items-start justify-between gap-3">
      <div class="flex min-w-0 items-start gap-2.5">
        <div
          v-if="icon"
          class="primary-gradient flex size-9 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg shadow-blue-500/20"
        >
          <UIcon :name="icon" class="size-4.5" />
        </div>
        <div class="min-w-0">
          <h2 v-if="title" class="truncate text-base font-bold text-slate-950 dark:text-white">
            {{ title }}
          </h2>
          <p v-if="subtitle" class="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {{ subtitle }}
          </p>
        </div>
      </div>
      <slot name="actions" />
    </div>
    <slot />
  </section>
</template>
