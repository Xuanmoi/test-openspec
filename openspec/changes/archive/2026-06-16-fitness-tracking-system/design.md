## Context

本项目从零搭建一个纯前端的健身追踪 Web 应用。用户需要管理个人信息快照和日常训练记录，所有数据保存在浏览器本地，无需账号或后端服务。技术栈选定 Nuxt 4，利用其文件路由、组合式 API 和 Pinia 状态管理能力快速交付。

当前仓库为空项目，无既有代码或 spec 需要兼容。

## Goals / Non-Goals

**Goals:**

- 提供个人信息与健身训练记录的完整 CRUD 能力
- 训练记录支持大组（动作名称）→ 小组（组别、重量、备注）的层级结构
- 日期默认当天，时段分为上午/下午/晚上
- 数据持久化至浏览器本地，刷新页面后数据不丢失
- 使用 Nuxt 4 + TypeScript + Pinia 构建，UI 简洁可用

**Non-Goals:**

- 用户认证与多设备同步
- 云端备份或数据导出
- 训练计划推荐、图表分析等高级功能
- 后端 API 或数据库

## Decisions

### 1. 框架：Nuxt 4

**选择**：Nuxt 4（最新稳定版）+ Vue 3 Composition API + TypeScript。

**理由**：用户明确要求 Nuxt 4；文件路由降低页面组织成本；`@pinia/nuxt` 官方集成状态管理；可 SSR/SPA 部署，本地应用以 SPA 模式运行即可。

**备选**：Vite + Vue 3 — 更轻量但缺少约定式路由与模块生态，不符合用户指定。

### 2. 本地存储：localStorage + Pinia 持久化

**选择**：使用 `@pinia-plugin-persistedstate/nuxt` 将 Pinia store 持久化到 `localStorage`。

**理由**：数据量小（个人记录 + 训练日志），localStorage API 简单可靠，无需 IndexedDB 的异步复杂度。

**备选**：IndexedDB — 适合大数据量或复杂查询，当前场景过度设计。

### 3. 数据模型

**个人信息（ProfileSnapshot）**：

```typescript
interface ProfileSnapshot {
  id: string          // UUID
  name: string
  height: number      // cm
  weight: number      // kg
  age?: number
  notes?: string
  createdAt: string   // ISO 8601
  updatedAt: string
}
```

每次更新创建新快照或原地更新并保留 `updatedAt`；历史列表按 `createdAt` 降序展示。删除为软删除或硬删除（硬删除，从数组中移除）。

**健身记录（WorkoutRecord）**：

```typescript
type TimeOfDay = 'morning' | 'afternoon' | 'evening'

interface WorkoutSet {
  id: string
  setNumber: number   // 当前组别（第几组）
  weight: number      // kg
  notes?: string
}

interface ExerciseGroup {
  id: string
  exerciseName: string
  sets: WorkoutSet[]
}

interface WorkoutRecord {
  id: string
  date: string        // YYYY-MM-DD，默认当天
  timeOfDay: TimeOfDay
  groups: ExerciseGroup[]
  createdAt: string
  updatedAt: string
}
```

### 4. 页面结构

| 路由 | 功能 |
|------|------|
| `/` | 首页/dashboard，快捷入口 |
| `/profile` | 当前个人信息表单 + 历史列表 |
| `/profile/history` | 历史记录详情（可选，或在 profile 页内嵌） |
| `/workouts` | 训练记录列表 |
| `/workouts/new` | 新建训练记录 |
| `/workouts/[id]` | 查看/编辑单条训练记录 |

### 5. 状态管理

两个 Pinia store：

- `useProfileStore` — 管理 `ProfileSnapshot[]`
- `useWorkoutStore` — 管理 `WorkoutRecord[]`

各 store 提供 CRUD actions，组件通过 composable 调用。

### 6. UI 方案

使用 Nuxt UI 或纯 Tailwind CSS 手写组件。优先选择 **@nuxt/ui** 以加速表单、按钮、卡片等基础组件开发。

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| localStorage 容量限制（~5MB） | 数据量极小，短期内不会触及上限 |
| 清除浏览器数据导致记录丢失 | 在 UI 提示用户数据仅存本地；后续可扩展导出功能 |
| 无多设备同步 | 明确为非目标，用户知情 |
| 日期/时段无自动校验 | 新建记录时 `date` 默认 `new Date()` 格式化为 YYYY-MM-DD，`timeOfDay` 可根据当前小时自动预选 |

## Migration Plan

不适用——全新项目，直接 `nuxi init` 初始化后按 tasks 逐步实现。

## Open Questions

- 个人信息字段是否需要扩展（如体脂率、目标体重）？当前采用基础字段，后续可按需 ADDED。
- 训练记录的「编辑」是原地修改还是生成新版本？建议原地修改并更新 `updatedAt`。
