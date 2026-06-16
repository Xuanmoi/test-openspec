<script setup lang="ts">
defineProps<{
  submitLabel?: string
  cancelLabel?: string
  showCancel?: boolean
}>()

const emit = defineEmits<{
  submit: []
  cancel: []
}>()
</script>

<template>
  <div class="app-action-bar fixed inset-x-0 z-40 px-4 pb-3">
    <div class="mx-auto flex max-w-md gap-3 rounded-[1.35rem] border border-blue-100/80 bg-white/95 p-3 shadow-2xl shadow-blue-500/10 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/95">
      <UButton
        v-if="showCancel"
        class="pressable"
        size="lg"
        variant="soft"
        :label="cancelLabel ?? '取消'"
        @click="emit('cancel')"
      />
      <UButton
        class="pressable flex-1"
        size="lg"
        color="primary"
        :label="submitLabel ?? '保存'"
        block
        @click="emit('submit')"
      />
    </div>
  </div>
</template>
