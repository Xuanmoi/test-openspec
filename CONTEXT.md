# Project Context

健身训练 Nuxt 4 应用，OpenSpec spec-driven 开发。

## 目录约定

| 路径 | 用途 |
|------|------|
| `app/pages/` | 路由页面 |
| `app/components/` | Vue 组件（`App*` 应用级，`Mobile*` 移动端，`Workout*` 训练域） |
| `app/stores/` | Pinia store，业务逻辑优先放 store |
| `app/utils/` | 纯函数工具 |
| `app/types/fitness.ts` | 领域类型 |
| `tests/unit/` | Vitest 单元测试 |
| `openspec/specs/` | 主规格 |
| `openspec/changes/` | 进行中变更 |

## 技术约定

- Nuxt UI 4 + Tailwind：`main.css` 顶部 `@import "tailwindcss"`、`@import "@nuxt/ui"`
- 根组件 `app.vue` 使用 `<UApp>` 包裹
- 主题色：`app.config.ts` 中 `ui.colors.primary: 'blue'`
- 全局样式类：`.app-card`、`.pressable`、`.primary-gradient` 等见 `main.css`
- 数据持久化：Pinia + `pinia-plugin-persistedstate`，`ssr: false`

## 测试约定

- 框架：Vitest + `@nuxt/test-utils`，配置见 `vitest.config.ts`
- 命令：`npm run test`（watch）、`npm run test:run`（CI/验证）
- 优先测 `stores/`、`utils/`，Scenario 来自 OpenSpec spec
- 时间相关逻辑用 `vi.useFakeTimers()` 控制

## OpenSpec 工作流

```
/opsx:propose → /opsx:apply → /opsx:verify → /opsx:review → /opsx:archive
```

## Code Review 检查点

- 实现是否覆盖当前 change 的 delta spec Scenario
- Store 是否保持单一数据源，避免页面重复业务逻辑
- 新字段是否考虑 localStorage 旧数据兼容
- 是否运行 `npm run test:run` 与 `npm run build`
