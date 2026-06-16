<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  subtitle?: string
  back?: boolean
}>(), {
  back: false,
})

const router = useRouter()
</script>

<template>
  <header class="sticky top-0 z-30 -mx-4 mb-4 bg-[var(--app-bg)]/90 px-4 py-2 backdrop-blur-xl">
    <div class="flex items-center gap-3">
      <button
        v-if="back"
        type="button"
        class="pressable tap-target -ml-2 flex items-center justify-center rounded-full text-gray-700 dark:text-gray-200"
        aria-label="返回"
        @click="router.back()"
      >
        <UIcon name="i-lucide-chevron-left" class="size-5" />
      </button>

      <div class="min-w-0 flex-1">
        <h1 class="truncate text-[22px] font-black tracking-tight text-gray-950 dark:text-white">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
          {{ subtitle }}
        </p>
      </div>

      <slot name="actions" />
    </div>
  </header>
</template>
