## Context

训练记录采用 `WorkoutRecord → ExerciseGroup → WorkoutSet` 三层结构。`WorkoutSet` 现有字段为 `setNumber`、`weight`、`notes?`。`WorkoutForm` 使用 2 列网格展示组别与重量，备注始终可见；`createEmptyGroup()` 返回空 `sets` 数组，需用户手动添加小组。

数据持久化在 Pinia + localStorage，存在无 `reps` 字段的历史记录。

## Goals / Non-Goals

**Goals:**

- 小组记录包含个数（`reps`），与组别、重量同为必填
- 表单一行展示组别、重量、个数，备注在后方且默认隐藏
- 勾选后才显示备注输入框；编辑已有备注的记录时自动展开
- 新增大组时默认生成 4 个小组（组别 1–4），支持删除与追加
- 详情页展示个数；旧数据兼容

**Non-Goals:**

- 不改动大组/记录层级的其他字段
- 不引入训练模板、动作库或自动填充历史重量
- 不改变列表页摘要逻辑（除非顺带展示总组数）

## Decisions

### 1. 字段命名与类型

- 使用 `reps: number` 表示个数（次/个），与健身场景通用术语一致
- 校验：`reps` 为正整数（≥ 1），与 `setNumber` 规则一致
- `weight` 保持 ≥ 0，允许 0（自重训练）

### 2. 默认四小组

- `createEmptyGroup()` 改为返回含 4 个 `WorkoutSet` 的大组，`setNumber` 依次为 1–4，`reps` 默认 0 或空待填（表单层用 `null` 引导填写，提交前校验）
- 实现上：`createEmptySet(setNumber)` 接受序号参数；`createEmptyGroup()` 循环生成 4 条

**备选：** 在 `WorkoutForm.addGroup` 中生成——否决，store 工厂方法更单一

### 3. 备注可选展示

- 每条小组维护本地 UI 状态 `showNotes: boolean`（不持久化）
- 初始值：`!!set.notes`（编辑时有备注则展开）
- 使用 `UCheckbox`「添加备注」切换；取消勾选不清空已填备注，仅隐藏输入框（避免误删）

### 4. 表单布局

- 移动端一行三列：`grid grid-cols-3 gap-2`，标签简写为「组」「kg」「个」
- 备注行单独占满宽，仅在 `showNotes` 为 true 时渲染
- 删除按钮保留在小组卡片右上角

### 5. 历史数据兼容

- 读取时：`reps ?? null`，详情页无值显示「—」
- 编辑旧记录：`reps` 为空则校验拦截并提示填写
- 不在加载时批量改写 localStorage（用户保存时自然补齐）

## Risks / Trade-offs

- [一行三列在窄屏可能拥挤] → 使用紧凑 `size="sm"` 输入框，标签用单字缩写
- [默认四小组增加空数据] → 提交时仍校验必填，未填完整则阻止保存
- [备注勾选状态不持久] → 仅 UI 层；有备注内容时编辑页自动展开

## Migration Plan

1. 扩展类型与 store 工厂方法
2. 更新 `WorkoutForm` 布局与校验
3. 更新详情页展示
4. 手动验证：新建（默认 4 组）、编辑旧记录、删除/添加小组

无需数据库迁移；localStorage 向后兼容。

## Open Questions

（无）
