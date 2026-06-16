<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <header class="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <NuxtLink to="/" class="text-lg font-semibold text-primary">
          健身记录
        </NuxtLink>
        <nav class="flex gap-1 sm:gap-2">
          <UButton to="/" variant="ghost" size="sm" label="首页" />
          <UButton to="/profile" variant="ghost" size="sm" label="个人信息" />
          <UButton to="/workouts" variant="ghost" size="sm" label="训练记录" />
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-3xl px-4 py-6">
      <slot />
    </main>
    <footer class="mx-auto max-w-3xl px-4 pb-6 text-center text-xs text-gray-500">
      数据仅保存在本机浏览器，清除浏览器数据将导致记录丢失
    </footer>
  </div>
</template>
