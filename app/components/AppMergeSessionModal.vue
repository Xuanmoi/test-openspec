<script setup lang="ts">
import type { WorkoutRecord } from '~/types/fitness'
import { formatMinutesSince, resolveDisplayTheme } from '~/utils/labels'

const props = defineProps<{
  targetRecord: WorkoutRecord
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  merge: []
  separate: []
}>()

const displayTheme = computed(() => resolveDisplayTheme(props.targetRecord))
const lastActiveLabel = computed(() =>
  formatMinutesSince(props.targetRecord.updatedAt || props.targetRecord.createdAt),
)
</script>

<template>
  <UModal v-model:open="open" title="归纳到同一主题？">
    <template #body>
      <div class="space-y-3 py-1">
        <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          距离你上一个主题锻炼不足一个小时，是否归纳到同一个主题？
        </p>
        <div class="rounded-2xl bg-blue-50 px-4 py-3 text-left dark:bg-blue-950/30">
          <p class="text-xs font-medium text-blue-600 dark:text-blue-400">
            上一条主题
          </p>
          <p class="mt-1 font-bold text-slate-950 dark:text-white">
            {{ displayTheme }}
          </p>
          <p class="mt-1 text-xs text-slate-500">
            {{ lastActiveLabel }}
          </p>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full flex-col gap-2 sm:flex-row">
        <UButton
          class="pressable flex-1"
          variant="outline"
          label="单独记录"
          @click="emit('separate')"
        />
        <UButton
          class="pressable flex-1"
          color="primary"
          label="归纳到同一主题"
          @click="emit('merge')"
        />
      </div>
    </template>
  </UModal>
</template>
