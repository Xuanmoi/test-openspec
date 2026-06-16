---
name: /opsx-verify
id: opsx-verify
category: Workflow
description: Verify an OpenSpec change — spec scenario coverage, tests, and build
---

Verify an implemented OpenSpec change: map spec scenarios to tests, run the test suite and build.

**Input**: Optionally specify a change name (e.g., `/opsx:verify workout-theme-session`). If omitted, check conversation context or list active changes.

**When to use**: After `/opsx:apply`, before `/opsx:review` or `/opsx:archive`.

**Steps**

1. **Select the change**

   Run `openspec list --json`. If multiple active changes exist, use **AskUserQuestion** to let the user select. Announce: "Verifying change: <name>".

2. **Load spec scenarios**

   Run `openspec status --change "<name>" --json` and read `artifactPaths.specs.existingOutputPaths`.
   Parse every `#### Scenario:` under `openspec/changes/<name>/specs/**/*.md`.
   Build a checklist: scenario name → requirement → expected test location.

3. **Audit test coverage**

   Search `tests/unit/` for tests related to the change (store, utils, or spec keywords).
   For each scenario, mark:
   - ✓ covered by an existing test
   - △ partially covered
   - ✗ missing

   If scenarios are missing tests and the change is still active, **write the missing tests** in `tests/unit/` following `CONTEXT.md` conventions. Prefer stores and utils over component tests.

4. **Run automation**

   Execute sequentially:
   ```bash
   npm run test:run
   npm run build
   ```
   Optionally run linter on files touched by the change.

5. **Report results**

   Output a structured summary (see format below). If tests or build fail, list failures and **stop** — suggest fixes before review/archive.

**Output On Success**

```
## Verify Complete

**Change:** <change-name>

### Spec 场景覆盖
| Scenario | 测试文件 | 状态 |
|----------|----------|------|
| ... | tests/unit/... | ✓ |

### 自动化
- npm run test:run → N passed
- npm run build → success

### 结论
✓ 可进入 /opsx:review
```

**Output On Failure**

```
## Verify Failed

**Change:** <change-name>

### 失败项
- <test or build error>

### 未覆盖 Scenario
- <scenario name>

修复后重新运行 /opsx:verify
```

**Guardrails**
- Do not archive the change in this command
- Map scenarios to tests using behavior names, not implementation details
- Use fake timers for time-dependent store logic (merge window, etc.)
- If no active change exists, report and stop
