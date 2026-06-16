## Why

健身爱好者需要一种简单、私密的方式来追踪个人身体数据和训练记录，但现有工具往往过于复杂或依赖云端账号。本变更将搭建一个基于 Nuxt 4 的本地健身系统，数据完全保存在浏览器本地，无需后端即可满足日常记录与回顾需求。

## What Changes

- 新建 Nuxt 4 健身追踪 Web 应用
- 支持个人信息的记录、更新、历史查看与删除
- 支持健身训练记录的创建与管理，包含日期（默认当天）、时段（上午/下午/晚上）、大组（动作名称）与小组（组别、重量、备注）的层级结构
- 所有数据持久化至浏览器本地存储（localStorage 或 IndexedDB）
- 提供基础 UI 用于录入、浏览与编辑上述数据

## Capabilities

### New Capabilities

- `personal-profile`: 个人信息的记录、更新、历史查看与删除
- `workout-records`: 健身训练记录的创建与管理，支持大组/小组层级结构与时段划分

### Modified Capabilities

（无——本项目为全新搭建，无既有 spec）

## Impact

- 新建完整 Nuxt 4 项目结构与页面路由
- 引入本地存储方案（Pinia + localStorage/IndexedDB）
- 无后端 API、无外部数据库依赖
- 纯前端应用，部署为静态站点即可
