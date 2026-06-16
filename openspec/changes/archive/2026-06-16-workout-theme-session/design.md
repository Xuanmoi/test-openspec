## Context

`WorkoutRecord` 当前含 `date`、`timeOfDay`、`groups`、`createdAt`、`updatedAt`。每次保存创建独立记录，无主题概念。用户连续记录多个动作时会产生多条时间相近的碎片记录。

本地单用户、Pinia + localStorage，无服务端。

## Goals / Non-Goals

**Goals:**

- 用户可为训练记录设置主题（预设：臀腿、背、胸肩、核心；支持自定义文本）
- 未设置主题时，展示名回退为第一个有名称的动作
- 保存时若距上一条记录 `updatedAt` 不足 1 小时，弹窗询问是否归纳
- 归纳：将新表单中的 `groups` 追加到上一条记录，刷新 `updatedAt`，不新建记录
- 拒绝归纳：正常 `create` 新记录
- 列表/详情/卡片展示解析后的主题名

**Non-Goals:**

- 不引入独立的 Session 实体或多用户
- 不自动修改历史记录主题（仅保存/合并时处理）
- 不跨天强制合并（仍以 1 小时时间窗为准，与日期字段独立）

## Decisions

### 1. 主题存储

- `WorkoutRecord.theme?: string` — 用户显式选择或输入的值；空表示未设置
- 预设列表：`['臀腿', '背', '胸肩', '核心']`，UI 用 `USelect` +「自定义」选项或允许 `creatable`
- `resolveDisplayTheme(record)`：`theme?.trim() || firstExerciseName || '训练记录'`

### 2. 时间精度与 1 小时判断

- 使用上一条记录的 `updatedAt`（无则 `createdAt`）与当前时间比较
- 阈值：`60 * 60 * 1000` ms
- 「上一条记录」= `sortedRecords[0]`（按日期 + 创建时间倒序的最新一条）
- 仅在新记录保存流程触发，编辑已有记录不弹窗

### 3. 归纳（合并）语义

- **是**：`workoutStore.appendGroups(targetId, newGroups)` — 追加大组、更新 `updatedAt`、保留目标记录原有 `theme`/`date`/`timeOfDay`（本次表单时段若不同以目标为准，或更新为本次 — 采用保留目标记录元数据，仅追加动作）
- 若本次表单填写了 `theme` 且目标无主题，合并时写入本次 `theme`
- **否**：`workoutStore.create(data)` 照常

### 4. 弹窗交互

- 组件：`AppMergeSessionModal`（`UModal`）
- 文案：「距离你上一个主题锻炼不足一个小时，是否归纳到同一个主题？」
- 副标题展示上一条解析主题名与相隔时间（可选）
- 按钮：「归纳到同一主题」/「单独记录」

### 5. 表单主题字段

- `WorkoutFormData.theme?: string`
- 位于基础信息区，时段下方
- 占位提示：「如臀腿、背、胸肩、核心；不填则使用动作名」
- 非必填

### 6. 旧数据兼容

- 无 `theme` 字段的记录：`resolveDisplayTheme` 回退动作名
- 合并检测对旧记录同样适用（基于 `updatedAt`）

## Risks / Trade-offs

- [用户编辑旧记录后 updatedAt 变化，可能影响 1 小时窗口] → 以 `updatedAt` 为「最后活动时间」，符合「连续锻炼」语义
- [合并后时段/日期与本次表单不一致] → 保留目标记录元数据，仅追加动作；文档说明
- [自定义主题与预设重复] → 允许，展示以存储字符串为准

## Migration Plan

1. 扩展类型与 store 方法
2. 表单 + 弹窗 + new 页保存流程
3. 展示层统一 `resolveDisplayTheme`
4. 验证：首次记录、1 小时内合并/拒绝、无主题回退、旧数据

## Open Questions

（无）
