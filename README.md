# Claude Pulse

> Free desktop widget that shows your Claude Code usage in real time — context window, 5-hour block, weekly limit, burn rate, cost. No more `/context` commands. No more "why am I rate-limited again?"

![status](https://img.shields.io/badge/status-v0.1.0-D97757)
![license](https://img.shields.io/badge/license-MIT-3a3a3a)
![platform](https://img.shields.io/badge/platform-Windows-3a3a3a)

---

## Why this exists

Claude Code on VS Code is amazing — but it hides six things you actually need to see while you work:

| # | Problem | What Claude Pulse does about it |
|---|---|---|
| 1 | **Rate limit drain mystery** — Max users hit 100% in 90 min with no warning | Live 5-hour block bar, burn-rate graph, panic alerts before you hit the wall |
| 2 | **Context window blindness** — no native 200k indicator | Live context-window bar reading directly from your session JSONL |
| 3 | **Cost in/out invisible** — total only, no input vs output split | Per-message token cards, API-equivalent $ cost |
| 4 | **Session handoff loss** — `/resume` broken, restart wipes everything | One-click handoff prompt generator from session JSONL |
| 5 | **VS Code extension crashes/hangs** — dual processes, 2 GB OOM | Process health tab, dual-process warning, hung-process detector |
| 6 | **No native usage UI** — must run `/cost`, `/context` every message, or open claude.ai | Persistent floating widget. Real Anthropic % via Chrome bridge. Glance, don't query. |

See [docs/PROBLEMS.md](docs/PROBLEMS.md) for sources + research.

---

## Install via Claude Code (one-paste, zero typing)

Paste this into any Claude Code session and Claude installs the widget for you:

```
Install Claude Pulse from https://github.com/koushiksirivella/claude-pulse —
clone to ~/Documents/claude-pulse, run install.bat, verify
http://localhost:7456/api/health returns {"ok":true}, then tell me when the
widget window is up. Free port 7456 first if it's taken.
```

Alternatively, copy the `skills/install-claude-pulse/` folder into your
`~/.claude/skills/` directory and just say "install claude pulse" — same result.

---

## 30-second install (Windows, manual)

```bash
git clone https://github.com/koushiksirivella/claude-pulse
cd claude-pulse
install.bat
```

That's it. Three steps. Widget pops up. No Chrome dance, no dev mode, no clicks.

Token count, $ cost, context window — all **exact**. (Bar % is 5-10% approximate; install the optional Chrome bridge in [docs/EXTENSION.md](docs/EXTENSION.md) if you want exact bars too.)

Full step-by-step: **[docs/INSTALL.md](docs/INSTALL.md)**

---

## What you see

```
┌─ CLAUDE PULSE ──────────── ↻ ▾ ─┐
│                                 │
│        [animated logo]          │
│                                 │
│   5-HOUR BLOCK   ████░░░  42%   │
│   tokens         9.24M          │
│   cost (API-eq)  $48.50         │
│   remain         3h 12m         │
│                                 │
│   CONTEXT WINDOW ███░░░░  34%   │
│   session b2567ee0  68.2k       │
│                                 │
│   WEEKLY LIMIT   ██░░░░░  18%   │
│   resets in 4d 12h              │
│                                 │
│   [ Tokens ] [ Caveman ] [ ... ]│
└─────────────────────────────────┘
```

The orange Claude Code mascot animates with mood (calm → focused → panicked) as you burn through your block.

---

## Bundled skills (the secret weapon)

`/skills` contains three open-source skills that cut your Claude Code token usage **~75%** while keeping full technical accuracy:

| Skill | What it does | Token savings |
|---|---|---|
| `caveman` | Strips filler/articles from Claude's responses ("the issue is" → "issue:") | ~75% |
| `caveman-commit` | Ultra-compressed Conventional Commits | ~70% |
| `caveman-review` | One-line code review feedback (location, problem, fix) | ~80% |

Copy any folder into your `~/.claude/skills/` directory and invoke with `/caveman`, `/caveman-commit`, `/caveman-review`. See **[docs/SKILLS.md](docs/SKILLS.md)**.

---

## Architecture (3 small parts)

```
claude.ai/settings/usage  ──┐
                            │ (Chrome extension scrapes %)
                            ▼
┌──────────────────────────────────┐
│  localhost:7456 Node.js server   │  ←── reads ~/.claude/projects/*/*.jsonl
│  • Background cache              │       (no API calls, no network)
│  • 15s ccusage refresh           │
│  • 1.5s context JSONL refresh    │
└──────────────────────────────────┘
                            │
                            ▼
              Chrome --app widget window
              (HTML/CSS/JS, no build step)
```

No telemetry. No keys. No cloud. Everything stays on your machine.

---

## Roadmap

- **v0.1** (current) — Chrome --app widget, Windows-first
- **v0.2** — Tauri native binary (true frameless, 5 MB .exe, cross-platform)
- **v0.3** — Caveman Suite UI inside the widget (toggle skills from the widget itself)
- **v0.4** — Handoff prompt generator (session JSONL → paste-ready Markdown)
- **v0.5** — Mac + Linux builds

---

## Contributing

Issues, screenshots, PRs welcome. If your widget shows wrong numbers, open an issue with your `widget/pulse.log` attached and a screenshot.

---

## Credits

Built by [Koushik](https://github.com/koushiksirivella) ([Dynasty Studio](https://dynastystudio.in)) using Claude Code itself.

Inspired by [ccusage](https://github.com/ryoppippi/ccusage) (the CLI that does the heavy ccu lifting).

License: MIT
