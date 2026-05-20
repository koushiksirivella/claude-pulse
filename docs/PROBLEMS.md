# The 6 problems Claude Pulse solves

Researched and validated against public bug trackers, Reddit threads, and Anthropic forum posts on **2026-05-19**. Sources cited inline.

---

## P1 — Rate-limit drain mystery

**The pain:** Max-plan users (the ones paying $100–200/mo) hit 100% of their 5-hour block in 60–90 minutes of normal Claude Code work and have no idea why. There's no live indicator. The first signal you get is the rate-limit error itself.

**Sources:**
- MacRumors thread, Mar 2026: "Burned through my Max in 75 minutes again."
- r/ClaudeCode multiple threads: "Why is the 5-hour limit hitting so fast?"
- Anthropic's official guidance: no UI for this; the only way to see it is `ccusage blocks --active` or visiting `claude.ai/settings/usage`.

**What Claude Pulse does:**
- Live 5-hour block bar, refreshed every 15 seconds via ccusage
- Burn-rate counter (tokens/minute)
- Projected "minutes remaining" if you keep this pace
- Color flips orange at 70%, red at 90%
- Optional auto-engage Caveman mode at user-set threshold

---

## P2 — Context window blindness

**The pain:** Claude Code doesn't tell you how much of the 200k context window you've used in the current session. You only find out at runtime when the compactor kicks in mid-task.

**Sources:**
- GitHub `claude-code/issues` multiple open issues asking for a context indicator
- Workaround: type `/context` every few messages (interrupts flow, costs tokens, gets stale immediately)

**What Claude Pulse does:**
- Reads the latest assistant `message.usage` block from your active session JSONL (`~/.claude/projects/<slug>/<session>.jsonl`)
- Computes `input + output + cache_creation + cache_read`
- Displays as % of 200k with live counter
- Refreshes every 1.5 seconds — no `/context` command needed

---

## P3 — Cost in/out ratio invisible

**The pain:** `ccusage` shows total cost but doesn't break out input vs output tokens per message. You can't tell if your tokens are going into context loading (cheap) or actual generation (expensive). This matters because output tokens cost 5× input tokens.

**Sources:**
- VS Marketplace: "Tokenlint" extension exists specifically to surface this gap
- ccusage roadmap notes the input/output split as a planned feature

**What Claude Pulse does:**
- Tokens tab shows 4 cards: input, output, cache-create, cache-read
- Per-model split: Opus vs Sonnet vs Haiku
- $ equivalent labeled clearly as "API-equivalent — Pro flat fee" (so you don't think you're being billed extra)

---

## P4 — Session handoff loss

**The pain:** When VS Code restarts or `/resume` fails (which it often does — see issues below), the entire context is gone. There's no built-in way to summarize what you were just doing and feed it to a fresh session.

**Sources:**
- GitHub `claude-code/issues/43696` — `/resume` not restoring full context
- GitHub `claude-code/issues/40286` — session resume loses tool history
- GitHub `claude-code/issues/11435` — session restart wipes working directory state

**What Claude Pulse does** (v0.4):
- "Copy Handoff Prompt" button generates a paste-ready Markdown block from the session JSONL
- Extracts: `cwd`, `gitBranch`, files touched, last user goal, last assistant state, skills invoked, total tokens used
- No LLM call — pure local parsing
- Paste into a fresh session and resume exactly where you left off

> Status: planned for v0.4. v0.1 ships P1–P3 + P6 first.

---

## P5 — VS Code extension crashes/hangs

**The pain:** The Claude Code VS Code extension intermittently spawns two processes, leaks memory up to 2–3 GB, and freezes the editor on Windows. Users routinely lose 10–30 minutes restarting and re-priming context.

**Sources:**
- GitHub `claude-code/issues/34678` — dual-process bug on Windows
- GitHub `claude-code/issues/25976` — memory leak / OOM
- GitHub `claude-code/issues/39807` — extension hangs on long sessions

**What Claude Pulse does** (v0.4 partial / v0.5 full):
- Process scanner shows all running `claude*` processes (PID, memory, working dir, start time)
- Warning badges: `DUAL PROCESS` if > 1 claude process active, `MEMORY HIGH` if > 2 GB
- Kill-stuck-process button (with confirmation)
- "Diagnose hang" → opens `/systematic-debugging` in Claude Code

> Status: process list working in v0.1. Kill button planned for v0.4.

---

## P6 — No native usage UI (the one everyone hits daily)

**The pain:** To see your current usage you must either:
1. Type `/cost` or `/context` in Claude Code (interrupts your flow, takes a turn, costs tokens)
2. Open a terminal and run `ccusage blocks --active`
3. Open a browser tab to `claude.ai/settings/usage`

You do this dozens of times a day. None of it is glanceable.

**Source:** every Claude Code user. This is the daily friction that triggered Claude Pulse in the first place.

**What Claude Pulse does:**
- Persistent floating widget — set-and-forget
- Glance at the corner of your screen → see exactly where you stand
- Real Anthropic % (via Chrome extension) so the number matches what you'd see in the dashboard
- No commands, no terminal, no tab-switching

This is the **core unlock**. The other five are the surrounding moat.

---

## Why ship this free + open source

Three reasons:

1. **The community deserves it.** Anthropic will eventually ship native usage UI. Until then, every Claude Code power-user needs this.
2. **Best portfolio piece.** A working open-source tool with real users beats any portfolio site for a developer trying to be taken seriously.
3. **Distribution.** The repo + the YouTube video + the skills bundle form a content moat that compounds over 90 days.

---

## Citations

All issue numbers reference https://github.com/anthropic/claude-code/issues — visit each one to confirm the bug is real and unsolved as of the date noted. If any get fixed upstream, this doc gets updated and the feature is deprecated in Claude Pulse (we want Anthropic to make us obsolete).
