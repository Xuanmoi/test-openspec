## 1. 数据模型与工具

- [x] 1.1 `WorkoutRecord` / `WorkoutFormData` 增加 `theme?: string`
- [x] 1.2 在 `utils/labels.ts` 增加预设主题常量 `WORKOUT_THEME_PRESETS` 与 `resolveDisplayTheme(record)` 函数

## 2. Store 逻辑

- [x] 2.1 `create` / `update` 写入 `theme`（trim 后空值存 undefined）
- [x] 2.2 新增 `getLatestRecord()`：返回时间最新的一条记录
- [x] 2.3 新增 `isWithinMergeWindow(record)`：判断距现在是否不足 1 小时
- [x] 2.4 新增 `appendGroups(id, groups, theme?)`：追加大组、补写主题、刷新 `updatedAt`

## 3. 表单与弹窗

- [x] 3.1 `WorkoutForm` 基础信息区增加主题选择（预设 + 可输入）
- [x] 3.2 新建 `AppMergeSessionModal`：归纳确认弹窗
- [x] 3.3 `workouts/new.vue`：保存前检测 1 小时窗口，弹窗后分支 merge / create

## 4. 展示层

- [x] 4.1 `WorkoutPreviewCard` 使用 `resolveDisplayTheme` 作为卡片标题
- [x] 4.2 `workouts/[id].vue` 详情头展示主题
- [x] 4.3 确认首页最近训练卡片展示主题

## 5. 验证

- [x] 5.1 验证：首条记录、1 小时内归纳/拒绝、超 1 小时直存、无主题回退动作名
- [x] 5.2 运行 `npm run build`
- [x] 5.3 检查 linter，无新增错误
