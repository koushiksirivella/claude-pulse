---
name: claude-pulse
description: Universal control skill for the Claude Pulse desktop widget. Triggers on "install claude pulse", "start pulse", "open pulse", "enable pulse", "launch pulse", "show pulse", "stop pulse", "close pulse", "kill pulse", "update pulse", "pulse status", "is pulse running", "/pulse", "/start-pulse". Detects intent (install vs start vs stop vs update vs status), then runs the appropriate action. Repo lives at github.com/koushiksirivella/claude-pulse and clones to ~/Documents/claude-pulse by default.
---

# Claude Pulse — universal control skill

Drop this folder into `~/.claude/skills/` once. From any Claude Code workspace,
the user can say things like:

- "install claude pulse" → clone repo + run install.bat
- "start pulse" / "open pulse" / "enable pulse" / "launch pulse" / "show pulse" → start widget
- "stop pulse" / "close pulse" / "kill pulse" → kill server + widget
- "update pulse" / "pull latest pulse" → git pull + relaunch
- "pulse status" / "is pulse running" → report server + widget state

The skill auto-detects intent from the phrasing and does the right thing.

---

## Constants

- **Repo URL:** `https://github.com/koushiksirivella/claude-pulse`
- **Default install dir (Windows):** `%USERPROFILE%\Documents\claude-pulse`
- **Default install dir (Mac/Linux):** `~/Documents/claude-pulse`
- **Server port:** `7456`
- **Health endpoint:** `http://localhost:7456/api/health`

Always resolve the install dir dynamically (env var, not literal) so it works
across user accounts.

---

## Step 1 — detect intent

Parse the user's message for keywords. Pick exactly one action:

| If message contains... | Action |
|---|---|
| `install`, `set up`, `setup`, `get me pulse`, `first time` | **INSTALL** |
| `start`, `open`, `enable`, `launch`, `show`, `bring up`, `run pulse` | **START** |
| `stop`, `close`, `kill`, `quit`, `shut down`, `turn off` | **STOP** |
| `update`, `pull latest`, `upgrade`, `refresh pulse` | **UPDATE** |
| `status`, `is pulse running`, `is it on`, `health` | **STATUS** |

If ambiguous (just "pulse"), default to **START**. If the repo dir doesn't
exist yet, **INSTALL** instead.

---

## Step 2 — execute

### INSTALL

1. Verify `git --version` and `node --version` (≥ 18). If missing, tell user
   to install them and stop.
2. Set `<dir>` = `%USERPROFILE%\Documents\claude-pulse` (Windows) or
   `~/Documents/claude-pulse` (Mac/Linux).
3. If `<dir>` doesn't exist:
   ```bash
   git clone https://github.com/koushiksirivella/claude-pulse <dir>
   ```
   If it exists, run `git -C <dir> pull origin main` instead.
4. Free port 7456 if taken (Windows):
   ```powershell
   $p = netstat -ano | Select-String ":7456.*LISTENING"
   if ($p) { $procId = ($p -split '\s+')[-1]; taskkill /F /PID $procId }
   ```
5. Run `<dir>\install.bat` (Windows). On Mac/Linux, run
   `cd <dir>/widget && node server.js &` then open
   `http://localhost:7456` in the user's default browser.
6. Wait 4 seconds, then `curl http://localhost:7456/api/health`. Confirm
   `{"ok":true}`.
7. Report: `"Claude Pulse installed at <dir>. Widget live on localhost:7456.
   Say 'start pulse' anytime to launch it again."`

Do NOT prompt the user about the SessionStart auto-launch hook — it's
unreliable on Windows VS Code. Do NOT auto-install the Chrome extension —
it's optional and documented in `<dir>/docs/EXTENSION.md`.

### START

1. Locate the repo dir. Try `%USERPROFILE%\Documents\claude-pulse` first.
   If it doesn't exist, fall back to INSTALL.
2. Check if widget already running:
   ```powershell
   $running = netstat -ano | Select-String ":7456.*LISTENING"
   ```
   If running, just relaunch the Chrome --app window without restarting the
   server.
3. If server not running, start it:
   ```powershell
   Push-Location <dir>\widget
   Start-Process node -ArgumentList "server.js" -WindowStyle Hidden
   Pop-Location
   Start-Sleep 3
   ```
4. Open the Chrome --app window:
   ```powershell
   Start-Process "chrome.exe" -ArgumentList "--app=http://localhost:7456","--window-size=340,500","--window-position=1170,80"
   Start-Sleep 2
   ```
5. Pin always-on-top:
   ```powershell
   & "<dir>\scripts\pin-on-top.ps1"
   ```
6. Report: `"Widget live. Glance at the top-right of your screen."`

### STOP

1. Kill the widget Chrome --app window:
   ```powershell
   Get-Process chrome -ErrorAction SilentlyContinue |
     Where-Object { $_.MainWindowTitle -like '*Claude Pulse*' -or $_.MainWindowTitle -like '*Mockup*' } |
     Stop-Process -Force
   ```
2. Kill the local server:
   ```powershell
   $p = netstat -ano | Select-String ":7456.*LISTENING"
   if ($p) { $procId = ($p -split '\s+')[-1]; taskkill /F /PID $procId }
   ```
3. Report: `"Claude Pulse stopped. Say 'start pulse' to bring it back."`

### UPDATE

1. Locate repo dir.
2. STOP first (see above).
3. `git -C <dir> pull origin main`
4. START again.
5. Report the new commit hash: `git -C <dir> log -1 --oneline`.

### STATUS

1. Check server: `curl http://localhost:7456/api/health` (5-second timeout).
2. Check widget process: `Get-Process chrome | Where-Object MainWindowTitle -like '*Pulse*'`.
3. Report one of:
   - "Server running, widget visible. All good."
   - "Server running, widget window not found. Run 'start pulse' to reopen."
   - "Pulse not running. Run 'start pulse' to launch."

---

## Step 3 — tell the user what was done (terse)

After any action, summarize in one line:

| Action | Sample reply |
|---|---|
| INSTALL | `"Installed at C:\Users\you\Documents\claude-pulse. Widget live."` |
| START   | `"Widget live on localhost:7456. Pinned on top."` |
| STOP    | `"Stopped. Server killed, widget closed."` |
| UPDATE  | `"Updated to <commit>. Widget restarted."` |
| STATUS  | `"Server: UP · Widget: VISIBLE · last refresh 1.2s ago."` |

Do not pad with explanations. The user wants speed.

---

## Failure modes

| Failure | What to tell user |
|---|---|
| Port 7456 held by non-Pulse process | "Port 7456 is held by PID <N>. Kill with `taskkill /F /PID <N>` and retry." |
| `git` missing | "Install git first: https://git-scm.com/download" |
| `node` < 18 | "Update Node.js to 18+ from https://nodejs.org" |
| Health check returns errors[] | Relay the first error verbatim, tell user to check `widget/pulse.log` |
| Chrome not on PATH | Fall back to `Start-Process "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"` |

---

## Why this skill exists

So the user never has to remember `cd ~/Documents/claude-pulse && launch.bat`.
They just say "start pulse" from any workspace and the widget appears.

For repo, docs, and the 6 problems it solves: github.com/koushiksirivella/claude-pulse
