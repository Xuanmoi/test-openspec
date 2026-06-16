<script setup lang="ts">
const links = [
  { title: '个人信息', description: '记录与查看身体数据', to: '/profile', icon: 'i-lucide-user' },
  { title: '新建训练', description: '记录今天的训练内容', to: '/workouts/new', icon: 'i-lucide-plus-circle' },
  { title: '训练历史', description: '浏览所有训练记录', to: '/workouts', icon: 'i-lucide-dumbbell' },
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-2xl font-bold">
      健身追踪
    </h1>
    <p class="mb-6 text-gray-600 dark:text-gray-400">
      记录个人信息与训练数据，数据保存在本地浏览器。
    </p>
    <div class="grid gap-4 sm:grid-cols-3">
      <UCard
        v-for="link in links"
        :key="link.to"
        class="cursor-pointer transition hover:ring-2 hover:ring-primary/50"
        @click="navigateTo(link.to)"
      >
        <div class="flex flex-col gap-2">
          <UIcon :name="link.icon" class="size-6 text-primary" />
          <h2 class="font-semibold">
            {{ link.title }}
          </h2>
          <p class="text-sm text-gray-500">
            {{ link.description }}
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
