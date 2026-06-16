## Why

当前训练小组只记录组别和重量，缺少「个数」维度，无法完整描述一组训练；表单布局也较松散，备注始终占位，新建动作时还需手动逐条添加小组，录入效率低。

## What Changes

- 为 `WorkoutSet` 增加 `reps`（个数）字段，必填，与组别、重量同级
- 小组表单布局调整：组别、重量、个数同一行；备注置于其后，默认折叠
- 备注改为可选：用户勾选「添加备注」后才展示输入框
- 新增大组动作时，默认预填 4 个小组（组别 1–4），用户可删除或继续添加
- 详情页展示个数；旧数据无 `reps` 时兼容显示

## Capabilities

### New Capabilities

（无）

### Modified Capabilities

- `workout-records`：扩展小组数据模型与表单/详情交互，增加个数字段、默认四小组、备注可选展示

## Impact

- `app/types/fitness.ts`：`WorkoutSet` 增加 `reps`
- `app/stores/workout.ts`：`createEmptyGroup` / `createEmptySet` 默认值与预填逻辑
- `app/components/WorkoutForm.vue`：表单布局、校验、备注勾选、默认四小组
- `app/pages/workouts/[id].vue`：详情展示个数
- `openspec/specs/workout-records/spec.md`：需求更新（通过 delta spec 同步）
