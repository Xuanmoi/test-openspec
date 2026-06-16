# blue-white-mobile-experience

## Purpose

定义健身追踪应用的蓝白移动端视觉与体验规范，包括 Tailwind 依赖策略、主题 token、页面布局与构建验证要求。

## Requirements

### Requirement: Tailwind 依赖核查

系统 SHALL 在进行样式主题改造前确认 Tailwind CSS 的实际依赖来源，并记录是否需要直接安装。

#### Scenario: Tailwind 由 Nuxt UI 提供

- **WHEN** `@nuxt/ui` 已带入 `tailwindcss`、`@tailwindcss/vite` 和 `@tailwindcss/postcss`
- **THEN** 系统不额外安装重复 Tailwind 依赖，并通过构建验证 utility class 可用

#### Scenario: Tailwind 构建缺失

- **WHEN** 构建或开发服务报告 Tailwind/Vite/PostCSS 插件缺失
- **THEN** 系统安装所需 Tailwind 直接依赖，并记录安装原因

### Requirement: 蓝白主题视觉系统

系统 SHALL 使用蓝白主题作为应用主视觉，包括浅蓝页面背景、白色卡片、蓝色主按钮和蓝色高亮态。

#### Scenario: 页面背景与卡片

- **WHEN** 用户浏览任意页面
- **THEN** 页面背景为浅蓝/近白色，主要内容使用白色圆角卡片承载

#### Scenario: 主色高亮

- **WHEN** 系统展示主要按钮、导航激活态、指标图标或关键状态
- **THEN** 使用蓝色系作为强调色

### Requirement: 清理红橙主题遗留

系统 SHALL 移除上一轮红橙主题在全局 token、导航、按钮、卡片和页面头部中的视觉痕迹。

#### Scenario: 全局变量更新

- **WHEN** 系统加载全局样式
- **THEN** `--app-primary`、`--app-primary-2`、渐变与阴影使用蓝色系

#### Scenario: 页面无红橙主视觉

- **WHEN** 用户浏览首页、记录页、详情页、我的页
- **THEN** 主要视觉区域不再使用红橙主题作为主色

### Requirement: Nuxt UI 蓝色主题配置

系统 SHALL 将 Nuxt UI 的 primary color 配置为蓝色，并保持配置位置符合 Nuxt UI 约定。

#### Scenario: App config 配置

- **WHEN** 应用加载 Nuxt UI 配置
- **THEN** `app.config.ts` 中的 `ui.colors.primary` 为 `blue`

#### Scenario: Nuxt config 无类型错误

- **WHEN** TypeScript 或 IDE 检查 `nuxt.config.ts`
- **THEN** 不出现 Nuxt UI `colors` 配置位置错误

### Requirement: 蓝白移动端 Dashboard

系统 SHALL 将首页 Dashboard 调整为蓝白风格，保留今日状态、核心指标、最近训练和快捷记录入口。

#### Scenario: 首页蓝白展示

- **WHEN** 用户进入首页
- **THEN** 首页展示蓝色 hero 区、白色指标卡和蓝色快捷记录按钮

#### Scenario: 空状态蓝白展示

- **WHEN** 用户无训练记录
- **THEN** 首页空状态使用蓝白风格，并提供开始记录 CTA

### Requirement: 蓝白训练记录流程

系统 SHALL 将训练记录表单和底部保存操作统一为蓝白移动端风格。

#### Scenario: 训练表单主题

- **WHEN** 用户进入新建或编辑训练页面
- **THEN** 表单区块、图标、按钮和错误提示符合蓝白主题

#### Scenario: 底部保存栏

- **WHEN** 用户编辑训练记录
- **THEN** 底部保存栏使用蓝色主按钮，并不遮挡内容

### Requirement: 蓝白详情与我的页面

系统 SHALL 将训练详情页和我的页面统一为蓝白主题，并保持现代移动端交互。

#### Scenario: 详情页主题

- **WHEN** 用户查看训练详情
- **THEN** 沉浸头部、内容卡片和底部操作栏使用蓝白主题

#### Scenario: 我的页主题

- **WHEN** 用户查看我的页面
- **THEN** 个人概览、身体指标和历史记录卡片使用蓝白主题

### Requirement: 构建与诊断验证

系统 SHALL 在主题改造后运行构建和诊断，验证 Tailwind utility、Nuxt UI 配置和页面代码可用。

#### Scenario: 构建通过

- **WHEN** 主题改造完成
- **THEN** `npm run build` 成功完成

#### Scenario: 无 linter 错误

- **WHEN** 检查修改过的配置和 app 文件
- **THEN** 不存在由本次改造引入的 linter/TypeScript 错误
