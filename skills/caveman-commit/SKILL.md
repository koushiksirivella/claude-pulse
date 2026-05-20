---
name: caveman-commit
description: >
  Generates ultra-compressed commit messages following Conventional Commits format.
  Cuts noise from commit messages while preserving intent and reasoning.
  Trigger: "write a commit", "commit message", "/caveman-commit".
---

## Core Purpose

Ultra-compressed commit messages. Format: Conventional Commits. No noise.

## Subject Line

`<type>(<scope>): <imperative summary>`

Types: feat, fix, refactor, perf, docs, test, chore, build, ci, style, revert
- Imperative mood: "add" not "added"
- Hard limit 72 chars, ideally ≤50
- No trailing period

## Body

Only when necessary: non-obvious reasoning, breaking changes, migration notes, linked issues. Skip when subject self-explanatory.

## Prohibited

No: "this commit does", first-person pronouns, AI attribution, emoji (unless project convention), redundant file names in scope.

## Critical Exception

Breaking changes, security fixes, data migrations, reversions — always require body with context.

## Scope

Generate message text as code block only. Do not execute git commands, stage files, or amend.
