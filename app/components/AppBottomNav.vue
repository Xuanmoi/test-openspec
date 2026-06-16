<script setup lang="ts">
const route = useRoute()

const isToday = computed(() => route.path === '/')
const isProfile = computed(() => route.path === '/profile')
const isRecord = computed(() => route.path.startsWith('/workouts/new'))
</script>

<template>
  <nav class="app-bottom-nav fixed inset-x-0 bottom-0 z-50 border-t border-blue-100/80 bg-white/95 shadow-[0_-8px_24px_rgba(37,99,235,0.08)] backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/95">
    <div class="mx-auto flex max-w-md items-end justify-around px-7 pt-2">
      <NuxtLink
        to="/"
        class="pressable flex flex-1 flex-col items-center gap-0.5 pb-2 text-[11px] font-semibold"
        :class="isToday ? 'text-blue-600' : 'text-slate-400'"
      >
        <UIcon name="i-lucide-sun-medium" class="size-6" />
        <span>今日</span>
      </NuxtLink>

      <NuxtLink
        to="/workouts/new"
        class="pressable relative -mt-8 flex flex-col items-center"
        aria-label="记录训练"
      >
        <span
          class="primary-gradient flex size-16 items-center justify-center rounded-[1.35rem] text-white shadow-xl shadow-blue-500/30"
          :class="{ 'ring-2 ring-blue-200 ring-offset-2 ring-offset-white dark:ring-offset-slate-950': isRecord }"
        >
          <UIcon name="i-lucide-plus" class="size-8" />
        </span>
        <span class="mt-1 text-[11px] font-semibold" :class="isRecord ? 'text-blue-600' : 'text-slate-400'">记录</span>
      </NuxtLink>

      <NuxtLink
        to="/profile"
        class="pressable flex flex-1 flex-col items-center gap-0.5 pb-2 text-[11px] font-semibold"
        :class="isProfile ? 'text-blue-600' : 'text-slate-400'"
      >
        <UIcon name="i-lucide-user-round" class="size-6" />
        <span>我的</span>
      </NuxtLink>
    </div>
  </nav>
</template>
