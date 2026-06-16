---
name: /opsx-review
id: opsx-review
category: Workflow
description: Review an OpenSpec change — spec compliance and coding standards
---

Review an implemented OpenSpec change along two axes: **Spec** (does code match delta spec?) and **Standards** (does code follow project conventions?).

**Input**: Optionally specify a change name or diff base (e.g., `/opsx:review workout-theme-session` or `/opsx:review main`). Default diff base: `main` or merge-base with main.

**When to use**: After `/opsx:verify` passes, before `/opsx:archive`.

**Steps**

1. **Select the change**

   Run `openspec list --json`. If multiple active changes, use **AskUserQuestion**. Announce: "Reviewing change: <name>".

2. **Pin the diff**

   ```bash
   git diff main...HEAD --stat
   git log main..HEAD --oneline
   ```
   If not a git repo or no main branch, diff against last archive point or list files under `openspec/changes/<name>/` impact from proposal.md.

3. **Load spec source**

   Read `openspec/changes/<name>/specs/**/*.md` (delta specs) and `openspec/changes/<name>/tasks.md`.
   For each Requirement / Scenario, check if implementation satisfies WHEN/THEN intent.

4. **Load standards source**

   Read in order:
   - `CONTEXT.md` (project conventions)
   - `openspec/config.yaml` (workflow rules)
   - Files referenced in the change's `proposal.md` Impact section

   Optionally read `~/.agents/skills/review/SKILL.md` for the two-axis review pattern.

5. **Review implementation files**

   Read changed app files (stores, components, pages, utils) from the diff.
   Note: spec gaps, regressions, missing edge cases, convention violations, type issues.

6. **Classify findings**

   - **blocking** — spec not met, broken behavior, must fix before archive
   - **minor** — style, optional improvement, non-blocking
   - **nit** — cosmetic

7. **Report**

   Output side-by-side Spec and Standards sections (see format below).

**Output Format**

```
## Review: <change-name>

### Spec 符合度
✓ <requirement> — <brief note>
△ <requirement> — <gap or partial>
✗ <requirement> — <missing>

### Standards
✓ <convention followed>
△ <minor issue>
✗ <violation>

### 建议（按优先级）
1. [blocking/minor] ...

### 结论
可归档 / 建议修复后重新 verify + review
```

**Guardrails**
- Spec axis uses delta spec as source of truth, not guesswork
- Do not block on nits unless user asks for strict review
- Do not archive in this command — suggest `/opsx:archive` when ready
- If verify was not run, recommend `/opsx:verify` first
