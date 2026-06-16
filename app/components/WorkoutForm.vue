<script setup lang="ts">
import type { ExerciseGroup, TimeOfDay, WorkoutFormData } from '~/types/fitness'
import { TIME_OF_DAY_OPTIONS } from '~/utils/labels'

const props = defineProps<{
  initial?: WorkoutFormData
  submitLabel?: string
  showCancel?: boolean
}>()

const emit = defineEmits<{
  submit: [data: WorkoutFormData]
  cancel: []
}>()

const workoutStore = useWorkoutStore()

const form = reactive<WorkoutFormData>({
  date: props.initial?.date ?? todayDate(),
  timeOfDay: props.initial?.timeOfDay ?? guessTimeOfDay(),
  groups: props.initial?.groups?.length
    ? JSON.parse(JSON.stringify(props.initial.groups))
    : [],
})

const errors = reactive({
  timeOfDay: '',
  groups: '',
  sets: {} as Record<string, string>,
})

function clearErrors() {
  errors.timeOfDay = ''
  errors.groups = ''
  errors.sets = {}
}

function addGroup() {
  form.groups.push(workoutStore.createEmptyGroup())
}

function removeGroup(groupId: string) {
  form.groups = form.groups.filter(g => g.id !== groupId)
}

function addSet(group: ExerciseGroup) {
  const nextNumber = group.sets.length > 0
    ? Math.max(...group.sets.map(s => s.setNumber)) + 1
    : 1
  group.sets.push({
    ...workoutStore.createEmptySet(),
    setNumber: nextNumber,
  })
}

function removeSet(group: ExerciseGroup, setId: string) {
  group.sets = group.sets.filter(s => s.id !== setId)
}

function validate(): boolean {
  clearErrors()
  let valid = true

  if (!form.timeOfDay) {
    errors.timeOfDay = '请选择时段'
    valid = false
  }

  if (form.groups.length === 0) {
    errors.groups = '请至少添加一个大组'
    valid = false
  }

  for (const group of form.groups) {
    if (!group.exerciseName.trim()) {
      errors.groups = '每个大组必须填写动作名称'
      valid = false
      break
    }
    for (const set of group.sets) {
      if (!set.setNumber || set.setNumber <= 0) {
        errors.sets[set.id] = '请填写有效组别'
        valid = false
      }
      if (set.weight === null || set.weight < 0) {
        errors.sets[set.id] = '请填写有效重量'
        valid = false
      }
    }
  }

  return valid
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', {
    date: form.date,
    timeOfDay: form.timeOfDay,
    groups: form.groups.map(g => ({
      ...g,
      exerciseName: g.exerciseName.trim(),
      sets: g.sets.map(s => ({
        ...s,
        notes: s.notes?.trim() || undefined,
      })),
    })),
  })
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField label="日期">
        <UInput v-model="form.date" type="date" class="w-full" />
      </UFormField>
      <UFormField label="时段" required :error="errors.timeOfDay">
        <USelect
          v-model="form.timeOfDay"
          :items="TIME_OF_DAY_OPTIONS"
          value-key="value"
          label-key="label"
          placeholder="选择时段"
          class="w-full"
        />
      </UFormField>
    </div>

    <div>
      <div class="mb-3 flex items-center justify-between">
        <h3 class="font-semibold">
          训练大组
        </h3>
        <UButton type="button" size="sm" variant="outline" icon="i-lucide-plus" label="添加大组" @click="addGroup" />
      </div>
      <p v-if="errors.groups" class="mb-2 text-sm text-error">
        {{ errors.groups }}
      </p>

      <div v-if="form.groups.length === 0" class="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700">
        点击「添加大组」开始记录训练动作
      </div>

      <div v-else class="space-y-4">
        <UCard v-for="(group, groupIndex) in form.groups" :key="group.id">
          <div class="mb-3 flex items-start justify-between gap-2">
            <UFormField :label="`大组 ${groupIndex + 1} - 动作名称`" class="flex-1">
              <UInput v-model="group.exerciseName" placeholder="例如：深蹲" class="w-full" />
            </UFormField>
            <UButton
              type="button"
              size="sm"
              color="error"
              variant="ghost"
              icon="i-lucide-trash-2"
              class="mt-6"
              @click="removeGroup(group.id)"
            />
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-600">小组</span>
              <UButton type="button" size="xs" variant="outline" label="添加小组" @click="addSet(group)" />
            </div>

            <div v-if="group.sets.length === 0" class="text-sm text-gray-400">
              暂无小组，点击「添加小组」
            </div>

            <div
              v-for="set in group.sets"
              :key="set.id"
              class="grid gap-2 rounded-md bg-gray-50 p-3 sm:grid-cols-[80px_1fr_1fr_auto] dark:bg-gray-900"
            >
              <UFormField label="组别" :error="errors.sets[set.id]">
                <UInput v-model.number="set.setNumber" type="number" min="1" class="w-full" />
              </UFormField>
              <UFormField label="重量 (kg)">
                <UInput v-model.number="set.weight" type="number" min="0" step="0.5" class="w-full" />
              </UFormField>
              <UFormField label="备注">
                <UInput v-model="set.notes" placeholder="可选" class="w-full" />
              </UFormField>
              <UButton
                type="button"
                size="sm"
                color="error"
                variant="ghost"
                icon="i-lucide-x"
                class="mt-5"
                @click="removeSet(group, set.id)"
              />
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <div class="flex gap-2">
      <UButton type="submit" :label="submitLabel ?? '保存'" />
      <UButton v-if="showCancel" type="button" variant="outline" label="取消" @click="emit('cancel')" />
    </div>
  </form>
</template>
