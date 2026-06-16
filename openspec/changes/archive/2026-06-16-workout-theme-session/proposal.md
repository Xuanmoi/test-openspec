## Why

当前训练记录只有日期和时段，缺少「练了什么部位/主题」的语义；用户连续录入多条动作时也无法识别是否属于同一次训练。需要引入训练主题，并在 1 小时内的连续记录提供智能归纳，减少碎片化记录。

## What Changes

- 为 `WorkoutRecord` 增加可选 `theme` 字段，支持预设主题（臀腿、背、胸肩、核心）及自定义输入
- 表单增加主题选择；未设置时，展示与存储回退为第一个动作名称
- 记录保存时间精确到 `createdAt` / `updatedAt`（ISO），用于判断与上一条记录的时间间隔
- 保存新记录时：若距上一条记录不足 1 小时，弹窗询问是否归纳到同一主题
  - 选择「是」：将本次动作合并进上一条记录（追加大组），不新建记录
  - 选择「否」：作为独立记录保存
- 列表、首页预览、详情页展示主题（有主题显示主题，无则显示首个动作名）

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `workout-records`：增加主题字段、默认回退规则、1 小时内归纳弹窗与合并逻辑、主题展示

## Impact

- `app/types/fitness.ts`：`WorkoutRecord`、`WorkoutFormData` 增加 `theme`
- `app/utils/labels.ts`：预设主题常量与展示辅助函数
- `app/stores/workout.ts`：`mergeIntoRecord`、`getLatestRecord`、`resolveDisplayTheme`
- `app/components/WorkoutForm.vue`：主题选择器
- `app/components/WorkoutPreviewCard.vue`、首页、列表、详情：主题展示
- `app/pages/workouts/new.vue`：保存前 1 小时检测与归纳弹窗
- 新增 `AppMergeSessionModal.vue`（或复用 Modal 模式）
