# Bundled skills

This repo ships three skills you can install into your local Claude Code in one minute. Each one cuts Claude Code's output tokens significantly without losing any technical substance.

| Skill | What it does | Avg savings | Best for |
|---|---|---|---|
| `caveman` | Strips articles, filler, hedging, pleasantries from Claude's replies — "the issue is in" becomes "issue:" | **~75%** | Daily coding sessions, debugging, exploration |
| `caveman-commit` | Generates ultra-tight Conventional Commits — drops "this commit", "in this PR" verbiage | **~70%** | Every `git commit` |
| `caveman-review` | One-line code review feedback: location → problem → fix | **~80%** | PR reviews, self-review |

---

## How they work

These are not LLMs themselves. They are **prompting skills** — small SKILL.md files that load into Claude's system prompt and modify how it writes.

When you invoke `/caveman`, Claude loads instructions like:

```
Respond like smart caveman. Drop: articles (a/an/the), filler (just/really),
pleasantries. Fragments OK. Technical terms exact. Code blocks unchanged.
```

The result: same correctness, ~25% the tokens. Multiplied by every message in a session, multiplied by every session in a week, this saves a meaningful share of your 5-hour block and weekly limit.

---

## Install (~60 seconds)

1. Locate your Claude skills folder:

   - Windows: `C:\Users\<you>\.claude\skills\`
   - Mac: `~/.claude/skills/`
   - Linux: `~/.claude/skills/`

2. Copy any of the three folders from this repo's `/skills` directory into that location:

   ```bash
   cp -r skills/caveman ~/.claude/skills/
   cp -r skills/caveman-commit ~/.claude/skills/
   cp -r skills/caveman-review ~/.claude/skills/
   ```

3. Restart Claude Code (or open a new session).

4. Invoke with slash commands:

   - `/caveman` — toggles compressed responses for the session
   - `/caveman-commit` — when you want a tight commit message
   - `/caveman-review` — when you want concise PR review feedback

---

## Intensity levels for `/caveman`

The skill supports 6 intensity tiers — pick based on how much terseness you want:

| Level | What changes | Example output |
|---|---|---|
| `lite` | No filler/hedging, full grammar | "Your component re-renders because you create a new object reference each render. Wrap it in useMemo." |
| `full` (default) | Drop articles, fragments OK | "New object ref each render. Inline prop = new ref = re-render. Wrap in useMemo." |
| `ultra` | Abbreviations + arrows for causality | "Inline obj prop → new ref → re-render. useMemo." |
| `wenyan-lite` | Semi-classical Chinese, classical register | "組件頻重繪，以每繪新生對象參照故。" |
| `wenyan-full` | Maximum classical terseness (~85% compression) | "物出新參照，致重繪。useMemo Wrap之。" |
| `wenyan-ultra` | Extreme classical compression | "新參照→重繪。useMemo Wrap。" |

Switch level mid-session with `/caveman <level>`. Default level is `full`. The skill respects code blocks, error quotes, and security warnings (these always stay full English).

---

## Why bundle these with Claude Pulse?

Two reasons:

1. **They directly attack P6.** Pulse shows you how much usage you have left; Caveman skills extend that runway by 3–4× without you noticing. Together they form the "see + act" pair.
2. **Community proof.** Open-source skills are how the Claude Code community shares knowledge. Bundling these here makes the repo a one-stop install for the most-asked-about workflow.

---

## Contributing your own

If you've written a skill that cuts tokens or fixes a Claude Code workflow, open a PR with:

1. A new folder under `/skills/<your-skill-name>/`
2. A `SKILL.md` file with the standard skill-format frontmatter
3. A row added to the table at the top of this doc

PRs accepted on a rolling basis. No bikeshedding on naming.

---

## Credits

- `caveman` — terse-output skill, MIT, multi-language support added 2026-04
- `caveman-commit` — derivative for Conventional Commits, MIT
- `caveman-review` — derivative for code review, MIT

All three live full-source in this repo under `/skills`.
