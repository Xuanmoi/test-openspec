<script setup lang="ts">
import type { ProfileFormData } from '~/types/fitness'
import { formatDateTime } from '~/utils/date'

const toast = useToast()
const profileStore = useProfileStore()
const workoutStore = useWorkoutStore()

const showForm = ref(false)
const form = reactive<ProfileFormData>({
  name: '',
  height: null,
  weight: null,
  age: null,
  notes: '',
})

const errors = reactive({ name: '', height: '', weight: '' })
const editingId = ref<string | null>(null)
const deleteTargetId = ref<string | null>(null)
const showDeleteModal = ref(false)

function resetForm() {
  form.name = ''
  form.height = null
  form.weight = null
  form.age = null
  form.notes = ''
  editingId.value = null
  showForm.value = false
  errors.name = errors.height = errors.weight = ''
}

function validate() {
  errors.name = errors.height = errors.weight = ''
  let valid = true
  if (!form.name.trim()) { errors.name = '请输入姓名'; valid = false }
  if (form.height === null || form.height <= 0) { errors.height = '请输入有效身高'; valid = false }
  if (form.weight === null || form.weight <= 0) { errors.weight = '请输入有效体重'; valid = false }
  return valid
}

function submit() {
  if (!validate()) return
  if (editingId.value) {
    const result = profileStore.update(editingId.value, form)
    if (!result) {
      toast.add({ title: '记录不存在', color: 'error' })
      return
    }
    toast.add({ title: '已更新', color: 'success' })
  }
  else {
    profileStore.create(form)
    toast.add({ title: '已保存', color: 'success' })
  }
  resetForm()
}

function startEdit(id: string) {
  const s = profileStore.getById(id)
  if (!s) return
  editingId.value = id
  showForm.value = true
  form.name = s.name
  form.height = s.height
  form.weight = s.weight
  form.age = s.age ?? null
  form.notes = s.notes ?? ''
}

function openNewForm() {
  resetForm()
  showForm.value = true
}

function confirmDelete(id: string) {
  deleteTargetId.value = id
  showDeleteModal.value = true
}

function executeDelete() {
  if (deleteTargetId.value) {
    profileStore.remove(deleteTargetId.value)
    if (editingId.value === deleteTargetId.value) resetForm()
    toast.add({ title: '已删除', color: 'success' })
  }
  showDeleteModal.value = false
  deleteTargetId.value = null
}

const latestProfile = computed(() => profileStore.sortedSnapshots[0])
const displayName = computed(() => latestProfile.value?.name || '健身用户')
const recordDays = computed(() => {
  const dates = new Set(profileStore.snapshots.map(snapshot => snapshot.createdAt.slice(0, 10)))
  return dates.size
})
</script>

<template>
  <div class="space-y-4">
    <MobileTopBar title="我的" subtitle="身体数据与训练状态" />

    <section class="soft-gradient overflow-hidden rounded-[1.6rem] p-5 text-white shadow-2xl shadow-blue-500/20">
      <div class="flex items-center gap-4">
        <div class="flex size-18 items-center justify-center rounded-[1.4rem] border border-white/25 bg-white/20 text-2xl font-black backdrop-blur">
          {{ displayName.slice(0, 1) }}
        </div>
        <div class="min-w-0">
          <h1 class="truncate text-2xl font-black">
            {{ displayName }}
          </h1>
          <p class="mt-1 text-sm text-white/75">
            记录身体变化，稳定向前
          </p>
        </div>
      </div>

      <div class="mt-5 grid grid-cols-3 gap-2 rounded-[1.2rem] bg-white/15 p-2 backdrop-blur">
        <div class="text-center">
          <p class="text-xl font-black">
            {{ workoutStore.records.length }}
          </p>
          <p class="text-[11px] text-white/70">
            训练
          </p>
        </div>
        <div class="text-center">
          <p class="text-xl font-black">
            {{ latestProfile?.weight ?? '—' }}
          </p>
          <p class="text-[11px] text-white/70">
            体重
          </p>
        </div>
        <div class="text-center">
          <p class="text-xl font-black">
            {{ recordDays }}
          </p>
          <p class="text-[11px] text-white/70">
            记录天
          </p>
        </div>
      </div>
    </section>

    <SectionCard title="身体数据" subtitle="更新当前身高、体重和备注" icon="i-lucide-scale">
      <template #actions>
        <UButton class="pressable" size="sm" color="primary" variant="soft" icon="i-lucide-plus" label="添加" @click="openNewForm" />
      </template>

      <div v-if="showForm" class="mb-4 rounded-[1.2rem] bg-gray-50 p-3 dark:bg-gray-950/40">
        <form class="space-y-3" @submit.prevent="submit">
          <UFormField label="姓名" required :error="errors.name">
            <UInput v-model="form.name" placeholder="姓名" size="lg" class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-2">
            <UFormField label="身高 cm" required :error="errors.height">
              <UInput v-model.number="form.height" type="number" min="1" size="lg" class="w-full" />
            </UFormField>
            <UFormField label="体重 kg" required :error="errors.weight">
              <UInput v-model.number="form.weight" type="number" min="1" step="0.1" size="lg" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="年龄（可选）">
            <UInput v-model.number="form.age" type="number" min="1" size="lg" class="w-full" />
          </UFormField>
          <UFormField label="备注（可选）">
            <UTextarea v-model="form.notes" :rows="3" class="w-full" />
          </UFormField>
          <div class="flex gap-2 pt-1">
            <UButton type="submit" class="pressable flex-1" color="primary" :label="editingId ? '保存修改' : '保存数据'" block />
            <UButton class="pressable" variant="soft" label="取消" @click="resetForm" />
          </div>
        </form>
      </div>

      <div v-if="profileStore.sortedSnapshots.length === 0 && !showForm" class="rounded-[1.2rem] border border-dashed border-gray-200 p-7 text-center dark:border-gray-800">
        <UIcon name="i-lucide-scale" class="mx-auto mb-2 size-9 text-gray-300" />
        <p class="font-bold text-gray-950 dark:text-white">
          暂无身体数据
        </p>
        <p class="mt-1 text-sm text-gray-500">
          添加第一条身体记录，建立自己的状态档案
        </p>
      </div>

      <div v-else class="space-y-3">
        <BodyRecordCard
          v-for="snapshot in profileStore.sortedSnapshots"
          :key="snapshot.id"
          :snapshot="snapshot"
          @edit="startEdit"
          @delete="confirmDelete"
        />
      </div>
    </SectionCard>

    <AppDeleteModal
      v-model:open="showDeleteModal"
      message="确定要删除这条身体记录吗？此操作不可撤销。"
      @confirm="executeDelete"
    />
  </div>
</template>
