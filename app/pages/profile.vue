<script setup lang="ts">
import type { ProfileFormData } from '~/types/fitness'
import { formatDateTime } from '~/utils/date'

const profileStore = useProfileStore()

const form = reactive<ProfileFormData>({
  name: '',
  height: null,
  weight: null,
  age: null,
  notes: '',
})

const errors = reactive({
  name: '',
  height: '',
  weight: '',
})

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
  clearErrors()
}

function clearErrors() {
  errors.name = ''
  errors.height = ''
  errors.weight = ''
}

function validate(): boolean {
  clearErrors()
  let valid = true

  if (!form.name.trim()) {
    errors.name = '请输入姓名'
    valid = false
  }
  if (form.height === null || form.height <= 0) {
    errors.height = '请输入有效身高（cm）'
    valid = false
  }
  if (form.weight === null || form.weight <= 0) {
    errors.weight = '请输入有效体重（kg）'
    valid = false
  }

  return valid
}

function submit() {
  if (!validate()) return

  if (editingId.value) {
    const result = profileStore.update(editingId.value, form)
    if (!result) {
      alert('记录不存在，可能已被删除')
    }
  }
  else {
    profileStore.create(form)
  }
  resetForm()
}

function startEdit(id: string) {
  const snapshot = profileStore.getById(id)
  if (!snapshot) return

  editingId.value = id
  form.name = snapshot.name
  form.height = snapshot.height
  form.weight = snapshot.weight
  form.age = snapshot.age ?? null
  form.notes = snapshot.notes ?? ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function confirmDelete(id: string) {
  deleteTargetId.value = id
  showDeleteModal.value = true
}

function executeDelete() {
  if (deleteTargetId.value) {
    profileStore.remove(deleteTargetId.value)
    if (editingId.value === deleteTargetId.value) {
      resetForm()
    }
  }
  showDeleteModal.value = false
  deleteTargetId.value = null
}
</script>

<template>
  <div class="space-y-8">
    <section>
      <h1 class="mb-4 text-2xl font-bold">
        {{ editingId ? '编辑个人信息' : '记录个人信息' }}
      </h1>
      <UCard>
        <form class="space-y-4" @submit.prevent="submit">
          <UFormField label="姓名" required :error="errors.name">
            <UInput v-model="form.name" placeholder="请输入姓名" class="w-full" />
          </UFormField>
          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField label="身高 (cm)" required :error="errors.height">
              <UInput v-model.number="form.height" type="number" min="1" placeholder="170" class="w-full" />
            </UFormField>
            <UFormField label="体重 (kg)" required :error="errors.weight">
              <UInput v-model.number="form.weight" type="number" min="1" step="0.1" placeholder="65" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="年龄（可选）">
            <UInput v-model.number="form.age" type="number" min="1" placeholder="25" class="w-full" />
          </UFormField>
          <UFormField label="备注（可选）">
            <UTextarea v-model="form.notes" placeholder="备注信息" class="w-full" />
          </UFormField>
          <div class="flex gap-2">
            <UButton type="submit" :label="editingId ? '保存修改' : '保存记录'" />
            <UButton v-if="editingId" variant="outline" label="取消编辑" @click="resetForm" />
          </div>
        </form>
      </UCard>
    </section>

    <section>
      <h2 class="mb-4 text-xl font-semibold">
        历史记录
      </h2>
      <div v-if="profileStore.sortedSnapshots.length === 0" class="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-700">
        <UIcon name="i-lucide-clipboard-list" class="mx-auto mb-2 size-8 opacity-50" />
        <p>暂无个人信息记录</p>
        <p class="mt-1 text-sm">
          填写上方表单开始记录
        </p>
      </div>
      <div v-else class="space-y-3">
        <UCard v-for="snapshot in profileStore.sortedSnapshots" :key="snapshot.id">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="font-medium">
                {{ snapshot.name }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                身高 {{ snapshot.height }} cm · 体重 {{ snapshot.weight }} kg
                <span v-if="snapshot.age"> · {{ snapshot.age }} 岁</span>
              </p>
              <p v-if="snapshot.notes" class="mt-1 text-sm text-gray-500">
                {{ snapshot.notes }}
              </p>
              <p class="mt-1 text-xs text-gray-400">
                创建于 {{ formatDateTime(snapshot.createdAt) }}
                <span v-if="snapshot.updatedAt !== snapshot.createdAt">
                  · 更新于 {{ formatDateTime(snapshot.updatedAt) }}
                </span>
              </p>
            </div>
            <div class="flex shrink-0 gap-2">
              <UButton size="sm" variant="outline" label="编辑" @click="startEdit(snapshot.id)" />
              <UButton size="sm" color="error" variant="outline" label="删除" @click="confirmDelete(snapshot.id)" />
            </div>
          </div>
        </UCard>
      </div>
    </section>

    <UModal v-model:open="showDeleteModal" title="确认删除">
      <template #body>
        <p>确定要删除这条个人信息记录吗？此操作不可撤销。</p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" label="取消" @click="showDeleteModal = false" />
          <UButton color="error" label="确认删除" @click="executeDelete" />
        </div>
      </template>
    </UModal>
  </div>
</template>
