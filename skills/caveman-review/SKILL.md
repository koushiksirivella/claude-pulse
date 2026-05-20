---
name: caveman-review
description: >
  Ultra-compressed code review feedback. One line per finding: location, problem, fix.
  Trigger: "review this PR", "code review", "/caveman-review".
---

## Core Purpose

One line per finding. Location + problem + fix. No filler.

## Format

`L<line>: <problem>. <fix>.`
`<file>:L<line>:` for multi-file diffs.

## Severity Prefixes

- 🔴 bug — broken behavior causing incidents
- 🟡 risk — fragile code (races, null checks, swallowed errors)
- 🔵 nit — style/naming/micro-optimization
- ❓ q — genuine questions

## Eliminate

"I noticed", "You might want to consider", general praise, restatements of what code does, hedging.

## Preserve

Line numbers, exact symbol names in backticks, concrete fixes, reasoning when fix not obvious.

## Exception

Normal paragraphs for: security findings, architectural disagreements needing rationale, onboarding scenarios.

## Scope

Review comments only. Does not write fixes, approve/request changes, or run linters.
