<script setup lang="ts">
defineProps<{
  title?: string
  message: string
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  confirm: []
}>()
</script>

<template>
  <UModal v-model:open="open" :title="title ?? '确认删除'">
    <template #body>
      <div class="flex flex-col items-center py-2 text-center sm:flex-row sm:text-left">
        <div class="mb-4 flex size-14 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40 sm:mb-0 sm:mr-4">
          <UIcon name="i-lucide-triangle-alert" class="size-7 text-red-500" />
        </div>
        <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {{ message }}
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full gap-2">
        <UButton class="tap-feedback flex-1" variant="outline" label="取消" @click="open = false" />
        <UButton class="tap-feedback flex-1" color="error" label="确认删除" @click="emit('confirm')" />
      </div>
    </template>
  </UModal>
</template>
