## Context

当前应用经过多轮 UI 调整后，代码中大量使用 Tailwind utility class，并通过 Nuxt UI 提供组件与样式集成。用户指出 `package.json` 没有直接声明 Tailwind 依赖，需要确认真实依赖情况；同时当前红橙主题不符合审美，希望切换为更清爽的蓝白主题。

依赖核查结果：

- `package.json` 直接依赖：`@nuxt/ui@4.8.2`
- `npm ls tailwindcss @tailwindcss/vite @tailwindcss/postcss --depth=2` 显示：
  - `@nuxt/ui@4.8.2` 带入 `tailwindcss@4.3.1`
  - `@nuxt/ui@4.8.2` 带入 `@tailwindcss/vite@4.3.1`
  - `@nuxt/ui@4.8.2` 带入 `@tailwindcss/postcss@4.3.1`

结论：当前 Tailwind 由 Nuxt UI 直接集成，项目构建可用，不需要立即安装额外 Tailwind 依赖。实现阶段应再次构建验证；只有在移除 Nuxt UI、需要独立 Tailwind 配置，或构建无法解析 Tailwind utility 时，才把 `tailwindcss` / `@tailwindcss/vite` 作为直接依赖安装。

## Goals / Non-Goals

**Goals:**

- 将视觉主题切换为蓝白：干净、轻量、现代、接近健康/效率类移动 App
- 保留现代移动端交互结构：底部导航、底部主操作、press feedback、toast、safe-area
- 清理红橙、小红书、过度渐变等不一致视觉痕迹
- 统一 Nuxt UI 主色、全局 CSS token、组件高亮色
- 验证 Tailwind utility 实际生效，并明确依赖策略

**Non-Goals:**

- 不改变训练记录、个人信息、本地存储业务逻辑
- 不重写为另一套 UI 框架
- 不为了“看起来直接依赖”而重复安装 Tailwind，除非构建或配置确实需要
- 不新增图表、社交、训练计划等功能

## Decisions

### 1. Tailwind 依赖策略

**选择**：继续通过 `@nuxt/ui` 使用 Tailwind 4 集成，不默认新增直接依赖。

**理由**：

- 当前 `npm ls` 已证明 Tailwind、Vite 插件、PostCSS 插件由 `@nuxt/ui` 提供
- 当前项目已经能构建通过
- 直接安装重复依赖会增加维护点，未必提升稳定性

**触发安装的条件**：

- `npm run build` 失败且错误指向 Tailwind/Vite/PostCSS 缺失
- 需要独立使用 Tailwind CLI 或自定义 Tailwind 构建链
- 未来移除 `@nuxt/ui`

### 2. 主题方向：Blue & White Mobile

| Token | 值 |
|------|----|
| 页面背景 | `#F4F8FF` / `#F8FBFF` |
| 主色 | `#2563EB`（blue-600） |
| 辅助色 | `#38BDF8`（sky-400） |
| 卡片 | `#FFFFFF` |
| 边框 | `#DBEAFE` / `#E5E7EB` |
| 文本 | `#0F172A` |

蓝色表达稳定、科技、清爽；白色提升留白与现代感，比红橙更适合健身记录工具。

### 3. Nuxt UI 主题

在 `app.config.ts` 中配置：

```ts
ui: {
  colors: {
    primary: 'blue',
    neutral: 'slate',
  },
}
```

`nuxt.config.ts` 只保留模块与 CSS 引入，避免把 Nuxt UI app config 放错位置。

### 4. 全局 CSS

重写 `app/assets/css/main.css` 中的 app token：

- `--app-primary: #2563eb`
- `--app-primary-2: #38bdf8`
- `--app-bg: #f4f8ff`
- `--app-surface: #ffffff`

保留：

- `safe-area` 变量
- `.pressable`
- `.app-card`
- `.app-action-bar`
- `.primary-gradient`
- `.soft-gradient`

移除或替换：

- 红橙相关 shadow、文字色、背景色
- 小红书 `note-card` / `masonry` 作为主视觉依赖

### 5. 页面调整

- 首页：蓝白 Dashboard，蓝色 hero，指标卡更克制
- 记录页：蓝色主按钮，表单区块白底 + 蓝色 icon
- 详情页：蓝色沉浸头部，底部操作栏保留但按钮主题改蓝
- 我的页：蓝色个人概览卡，身体记录卡片保留白色
- 历史页：日期分组 + 白色卡片 + 蓝色状态标签

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| 用户误以为没直接安装 Tailwind 就不可用 | 在提案和任务中记录 `npm ls` 结论，并用构建验证 |
| 蓝白主题过于普通 | 用 subtle gradient、阴影、间距和状态反馈提升现代感 |
| 多轮 UI 变更留下旧色彩 | 任务中明确全局搜索/替换 red/rose/orange 样式 |
| Nuxt UI 配置位置错误 | 使用 `app.config.ts`，并用 linter 验证 |

## Migration Plan

无需数据迁移。实现时先核查依赖，再替换主题 token 和组件颜色，最后运行 linter 与构建验证。若构建提示 Tailwind 缺失，再通过 npm 安装直接依赖并记录原因。

## Open Questions

- 是否需要完全移除上一轮未使用组件（如 `FeedCard` / `MasonryFeed`）？建议先保留未引用组件，后续归档/清理时再统一删除，避免本轮主题改造扩大范围。
