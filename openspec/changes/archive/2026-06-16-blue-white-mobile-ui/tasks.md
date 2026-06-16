## 1. Tailwind 依赖确认

- [x] 1.1 运行 `npm ls tailwindcss @tailwindcss/vite @tailwindcss/postcss --depth=2`，确认 Tailwind 来源
- [x] 1.2 若 Tailwind 构建链缺失，安装必要直接依赖；若由 `@nuxt/ui` 提供且构建通过，则不重复安装
- [x] 1.3 在实现总结中说明最终依赖结论

## 2. 主题配置

- [x] 2.1 更新 `app.config.ts`：将 Nuxt UI primary color 改为 `blue`
- [x] 2.2 确认 `nuxt.config.ts` 不包含错误位置的 `ui.colors` 配置
- [x] 2.3 检查 `package.json`，仅在确实安装依赖时更新

## 3. 全局蓝白样式

- [x] 3.1 重写 `app/assets/css/main.css` 的 app token：背景、surface、primary、secondary 改为蓝白系
- [x] 3.2 将 `.primary-gradient`、`.soft-gradient`、阴影、focus/press feedback 改为蓝色系
- [x] 3.3 清理主流程中红橙、小红书相关主视觉 class 和 CSS 变量

## 4. 导航与基础组件

- [x] 4.1 重构 `AppBottomNav`：激活态、中心记录按钮、阴影改为蓝白主题
- [x] 4.2 重构 `MobileActionBar`：底部主按钮、边框和阴影改为蓝白主题
- [x] 4.3 重构 `MetricTile`、`SectionCard`、`WorkoutPreviewCard`、`BodyRecordCard` 的强调色为蓝色
- [x] 4.4 保留 `pressable` 与 `safe-area` 交互能力

## 5. 页面蓝白主题

- [x] 5.1 重构首页 `/`：蓝色 hero、白色指标卡、蓝色 CTA
- [x] 5.2 重构 `/workouts/new` 与 `WorkoutForm`：蓝色表单强调、蓝色底部保存栏
- [x] 5.3 重构 `/workouts/[id]`：蓝色详情头部、蓝色操作栏
- [x] 5.4 重构 `/workouts`：蓝白历史列表与日期分组
- [x] 5.5 重构 `/profile`：蓝白个人概览与身体记录卡

## 6. 验证

- [x] 6.1 运行 `npm run build`，确认 Tailwind utility 和 Nuxt UI 主题生效
- [x] 6.2 运行 linter/diagnostics，确认无新增类型或配置错误
- [x] 6.3 检查 375px 宽度下底部导航、底部操作栏和表单无遮挡、无横向溢出
- [x] 6.4 确认页面主视觉不再使用红橙主题
