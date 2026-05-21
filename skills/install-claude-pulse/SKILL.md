---
name: install-claude-pulse
description: One-prompt installer for Claude Pulse (the local Claude Code usage widget). Use when the user says "install claude pulse", "set up pulse", "/install-pulse", "get me the pulse widget", "i want that pulse thing", or any variation asking for the widget from github.com/koushiksirivella/claude-pulse to be installed locally.
---

# Install Claude Pulse — one-prompt skill

When invoked, install Claude Pulse on the user's machine in one shot. No questions, no confirmation prompts unless something fails.

## What this skill does

1. Clones https://github.com/koushiksirivella/claude-pulse to a sensible directory
2. Runs the OS-appropriate installer (`install.bat` on Windows)
3. Verifies the local server is healthy at http://localhost:7456/api/health
4. Reports success with the widget URL

## Step-by-step instructions for the assistant

### 1. Detect platform

- Windows: target dir = `%USERPROFILE%\Documents\claude-pulse`
- macOS/Linux: target dir = `~/Documents/claude-pulse`

Use `os.platform()` semantics — `win32` vs everything else.

### 2. Check prerequisites

Verify these are installed (skip cleanly if already cloned):

| Tool | Check command | Required? |
|---|---|---|
| git | `git --version` | Yes |
| node | `node --version` (needs ≥ 18) | Yes |
| chrome.exe | `where chrome` (Windows) | Strongly recommended (widget uses Chrome --app) |

If git or node missing → tell user to install them first, stop.

### 3. Clone the repo

```bash
git clone https://github.com/koushiksirivella/claude-pulse <target-dir>
```

If `<target-dir>` already exists → `cd` in and run `git pull origin main` instead.

### 4. Free port 7456 if taken

Windows:
```powershell
$port = netstat -ano | Select-String ":7456.*LISTENING"
if ($port) { $pid = ($port -split '\s+')[-1]; taskkill /F /PID $pid }
```

### 5. Launch the installer

Windows: from inside the repo dir, run:
```bash
install.bat
```

This script:
- Verifies node
- Starts `node server.js` in the background on port 7456
- Opens Chrome `--app=http://localhost:7456` at 510×900 px
- Pins the window always-on-top via `scripts/pin-on-top.ps1`

### 6. Verify health

Wait 3-5 seconds, then:
```bash
curl http://localhost:7456/api/health
```

Expected response: `{"ok":true,"uptime":<seconds>,"errors":[]}`

If `errors` array is non-empty → relay the first error to the user and stop.

### 6.5. (Removed in v0.1.3) Auto-launch on Claude Code SessionStart

The SessionStart hook was removed from the default flow — it's unreliable on
Windows VS Code. Do NOT prompt the user to enable it. If they explicitly ask
for auto-start, point them to the Startup-folder method in docs/INSTALL.md.

### 7. Report success

Tell the user (caveman-terse is fine):

```
Claude Pulse installed. Widget live at http://localhost:7456
Repo: <target-dir>
Re-launch anytime: double-click <target-dir>/launch.bat
Optional Chrome bridge for exact bar %: see docs/EXTENSION.md
```

## Important notes

- **Do NOT install or configure the Chrome extension automatically.** It is fully optional. Users who want exact bar % can follow `docs/EXTENSION.md` themselves.
- **Do NOT run `npm install`.** The widget has zero npm dependencies; `node server.js` runs directly on the standard library.
- **Do NOT modify the user's PATH, registry, or startup folder.** Auto-start on boot is the user's choice — instructions in `docs/INSTALL.md` under "Daily use."
- **Do NOT push tokens to Anthropic during this install.** Everything is local file reads + a single git clone.

## Failure modes and what to say

| Failure | What to tell user |
|---|---|
| `git` missing | "Install git first: https://git-scm.com/download" |
| `node` missing or < 18 | "Install Node.js 18+ from https://nodejs.org" |
| Port 7456 taken and can't free | "Port 7456 is held by PID <N>. Kill it manually with `taskkill /F /PID <N>` and retry." |
| Server starts but `/api/health` fails | "Server didn't bind. Check `widget/pulse.log` in the repo for the actual error." |
| Chrome not found | "Widget will still work — open http://localhost:7456 in any browser. For the floating-window UX, install Chrome." |

## Why this skill exists

Claude Pulse solves 6 pain points in Claude Code (rate-limit drain mystery, context blindness, in/out cost ratio, session handoff loss, VS Code crashes, no native usage UI). Users who heard about it from YouTube or GitHub should be able to install it in 30 seconds without reading docs. This skill is that 30-second install.

## Update behavior

If the user says "update claude pulse" or "pull latest pulse":
1. `cd` to the existing repo dir
2. `git pull origin main`
3. Kill the running server (`taskkill` on port 7456)
4. Re-run `install.bat`
5. Verify health again
