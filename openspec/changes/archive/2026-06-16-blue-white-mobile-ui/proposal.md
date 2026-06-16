## Why

当前代码大量使用 Tailwind utility class，但 `package.json` 没有直接声明 `tailwindcss`，容易让项目依赖关系看起来不清晰；同时当前红橙主题仍不符合用户期望，整体视觉需要切换为更干净、现代、偏原生移动 App 的蓝白主题。

已确认依赖情况：`@nuxt/ui@4.8.2` 已经带入 `tailwindcss@4.3.1`、`@tailwindcss/vite@4.3.1`、`@tailwindcss/postcss@4.3.1`，当前不需要额外安装 Tailwind；实现阶段应保留构建验证，如果发现 Nuxt UI 之外的 Tailwind 配置需求，再补充直接依赖。

## What Changes

- 审计 Tailwind 依赖与 Nuxt UI 集成，确认是否需要直接安装 `tailwindcss`
- 将应用主题从红橙改为蓝白：白色卡片、浅蓝背景、蓝色主按钮与高亮状态
- 重构全局 CSS token，移除上一轮红橙/小红书遗留变量与视觉语言
- 调整底部导航、Dashboard、训练表单、详情页、我的页的视觉层级，统一为蓝白移动端 App 风格
- 保留现代移动端交互：底部主操作、press feedback、toast、确认弹窗、safe-area 适配
- 运行构建和 linter 验证，确保 Tailwind utility class 实际生效

## Capabilities

### New Capabilities

- `blue-white-mobile-experience`: 蓝白主题的现代移动端视觉系统、Tailwind 依赖确认、页面与交互一致性规范

### Modified Capabilities

（无——不改变健身记录与个人信息业务规则，仅调整主题、样式与交互呈现）

## Impact

- 影响 `package.json`（仅在需要直接安装 Tailwind 时）
- 影响 `app.config.ts`、`app/assets/css/main.css`、`app/layouts/default.vue`
- 影响页面与组件样式：`app/pages/**`、`app/components/**`
- 不改变 Pinia store、类型定义、localStorage 数据结构
