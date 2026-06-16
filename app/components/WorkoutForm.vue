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

const toast = useToast()
const workoutStore = useWorkoutStore()

const form = reactive<WorkoutFormData>({
  date: props.initial?.date ?? todayDate(),
  timeOfDay: props.initial?.timeOfDay ?? guessTimeOfDay(),
  groups: props.initial?.groups?.length
    ? JSON.parse(JSON.stringify(props.initial.groups))
    : [],
})

const openGroups = ref<Record<string, boolean>>({})

watch(
  () => form.groups.map(g => g.id),
  (ids) => {
    for (const id of ids) {
      if (openGroups.value[id] === undefined) {
        openGroups.value[id] = true
      }
    }
  },
  { immediate: true },
)

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
  const group = workoutStore.createEmptyGroup()
  form.groups.push(group)
  openGroups.value[group.id] = true
}

function removeGroup(groupId: string) {
  form.groups = form.groups.filter(g => g.id !== groupId)
  delete openGroups.value[groupId]
}

function toggleGroup(groupId: string) {
  openGroups.value[groupId] = !openGroups.value[groupId]
}

function addSet(group: ExerciseGroup) {
  const nextNumber = group.sets.length > 0
    ? Math.max(...group.sets.map(s => s.setNumber)) + 1
    : 1
  group.sets.push({
    ...workoutStore.createEmptySet(),
    setNumber: nextNumber,
  })
  openGroups.value[group.id] = true
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

  if (!valid) {
    toast.add({ title: '请检查表单', description: '部分必填项未填写', color: 'warning' })
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
  <form class="space-y-4 pb-[calc(var(--app-action-bar-height)+1rem)]" @submit.prevent="handleSubmit">
    <SectionCard title="基础信息" subtitle="日期会默认填为今天，也可以手动调整" icon="i-lucide-calendar-days">
      <div class="grid grid-cols-1 gap-3">
        <UFormField label="训练日期">
          <UInput v-model="form.date" type="date" size="lg" class="w-full" />
        </UFormField>
        <UFormField label="训练时段" required :error="errors.timeOfDay">
          <USelect
            v-model="form.timeOfDay"
            :items="TIME_OF_DAY_OPTIONS"
            value-key="value"
            label-key="label"
            placeholder="选择时段"
            size="lg"
            class="w-full"
          />
        </UFormField>
      </div>
    </SectionCard>

    <SectionCard title="训练动作" subtitle="每个动作是一组，可继续添加多组小组明细" icon="i-lucide-dumbbell">
      <template #actions>
        <UButton type="button" class="pressable" size="sm" color="primary" variant="soft" icon="i-lucide-plus" label="动作" @click="addGroup" />
      </template>

      <p v-if="errors.groups" class="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 dark:bg-red-950/40">
        {{ errors.groups }}
      </p>

      <div v-if="form.groups.length === 0" class="rounded-[1.2rem] border border-dashed border-gray-200 p-7 text-center dark:border-gray-800">
        <UIcon name="i-lucide-circle-plus" class="mx-auto mb-2 size-8 text-gray-300" />
        <p class="text-sm text-gray-500">
          添加第一个训练动作
        </p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(group, groupIndex) in form.groups"
          :key="group.id"
          class="overflow-hidden rounded-[1.2rem] border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/40"
        >
          <button
            type="button"
            class="pressable flex w-full items-center gap-3 px-3 py-3 text-left"
            @click="toggleGroup(group.id)"
          >
            <span class="primary-gradient flex size-9 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white">
              {{ groupIndex + 1 }}
            </span>
            <div class="min-w-0 flex-1">
              <p class="truncate font-bold text-gray-950 dark:text-white">
                {{ group.exerciseName || '未命名动作' }}
              </p>
              <p class="text-xs text-gray-500">
                {{ group.sets.length }} 个小组
              </p>
            </div>
            <UIcon
              name="i-lucide-chevron-down"
              class="size-5 text-gray-400 transition-transform"
              :class="{ 'rotate-180': openGroups[group.id] }"
            />
          </button>

          <div v-show="openGroups[group.id]" class="space-y-3 border-t border-white px-3 pb-3 pt-3 dark:border-gray-800">
            <UFormField label="动作名称">
              <UInput v-model="group.exerciseName" placeholder="例如：深蹲" size="lg" class="w-full" />
            </UFormField>

            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-gray-500">小组明细</span>
              <UButton type="button" class="pressable" size="xs" color="primary" variant="soft" icon="i-lucide-plus" label="小组" @click="addSet(group)" />
            </div>

            <div v-if="group.sets.length === 0" class="rounded-xl bg-white/70 py-4 text-center text-sm text-gray-400 dark:bg-gray-900/60">
              暂无小组，点击右上角添加
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="set in group.sets"
                :key="set.id"
                class="rounded-2xl bg-white p-3 dark:bg-gray-900"
              >
                <div class="mb-3 flex items-center justify-between">
                  <span class="text-xs font-bold text-gray-500">第 {{ set.setNumber }} 组</span>
                  <UButton
                    type="button"
                    size="xs"
                    color="error"
                    variant="ghost"
                    icon="i-lucide-x"
                    class="tap-target pressable"
                    @click="removeSet(group, set.id)"
                  />
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <UFormField label="组别" :error="errors.sets[set.id]">
                    <UInput v-model.number="set.setNumber" type="number" min="1" class="w-full" />
                  </UFormField>
                  <UFormField label="重量 kg">
                    <UInput v-model.number="set.weight" type="number" min="0" step="0.5" class="w-full" />
                  </UFormField>
                  <UFormField label="备注" class="col-span-2">
                    <UInput v-model="set.notes" placeholder="可选，例如：状态不错" class="w-full" />
                  </UFormField>
                </div>
              </div>
            </div>

            <UButton
              type="button"
              class="pressable"
              size="sm"
              color="error"
              variant="ghost"
              icon="i-lucide-trash-2"
              label="删除这个动作"
              block
              @click="removeGroup(group.id)"
            />
          </div>
        </div>
      </div>
    </SectionCard>

    <MobileActionBar
      :submit-label="submitLabel ?? '保存记录'"
      :show-cancel="showCancel"
      @submit="handleSubmit"
      @cancel="emit('cancel')"
    />
  </form>
</template>
