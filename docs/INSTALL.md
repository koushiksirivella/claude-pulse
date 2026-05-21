# Install Claude Pulse

Total time: **~60 seconds** if you have Node + Chrome. ~3 min if you need to install Node first.

---

## Prerequisites

| Need | Why | Get it |
|---|---|---|
| Windows 10/11 | v0.1 is Windows-first | — |
| Node.js 18+ | Runs the local server | https://nodejs.org/ (LTS) |
| Google Chrome | Widget runs as Chrome --app | https://chrome.com |
| Claude Code installed | So the widget has session JSONL to read | https://claude.com/code |

Mac and Linux support coming in v0.5.

---

## Step 1 — Clone the repo

```bash
git clone https://github.com/koushiksirivella/claude-pulse
cd claude-pulse
```

Or download the ZIP from GitHub → extract → open the folder.

---

## Step 2 — Run install.bat

Double-click `install.bat`.

You should see:

```
============================================
  Claude Pulse v0.1.0 - Installer
============================================
[OK] Node.js found
Starting Claude Pulse server on http://localhost:7456 ...
Launching widget window...
```

A small floating window appears showing 5-hour block, context window, weekly limit. Numbers will populate within ~5 seconds once Claude Code session data is detected.

---

## Step 3 — DONE

Widget is running. Glance at it whenever you want.

Every absolute number (tokens, $, context %, burn rate) is already **exact**. Only the 5h block and weekly bars are 5-10% approximate vs Anthropic's weighted formula.

Want bar % to exactly match `claude.ai/settings/usage`? See **[EXTENSION.md](EXTENSION.md)** for the optional Chrome bridge. Otherwise ignore — you're not missing meaningful data.

---

## Step 4 — Always-on-top (auto from v0.1.1)

`install.bat` and `launch.bat` now run `scripts/pin-on-top.ps1` automatically. Widget stays in front of VS Code, browser, Slack — every other window. Click VS Code, type code, glance up at widget, repeat.

To unpin (let it go to background like a normal window):

```powershell
.\scripts\pin-on-top.ps1 -unpin
```

To re-pin manually:

```powershell
.\scripts\pin-on-top.ps1
```

---

## Step 5 — (Optional) Strip Chrome's mini caption bar

Chrome --app windows still show a tiny title bar at the very top. To remove it:

```powershell
.\scripts\strip-titlebar.ps1
```

Run this **after** the widget is open. It uses Win32 `SetWindowLong` to remove `WS_CAPTION | WS_THICKFRAME`. Reversible — just close + reopen the widget.

For a truly frameless build that doesn't need this hack, wait for v0.2 (Tauri).

---

## Daily use

After the first install, you don't need to run `install.bat` again. Just double-click `launch.bat` whenever you want to bring the widget up.

### Auto-launch on every Claude Code session (OPT-IN — not recommended for v0.1)

> The SessionStart hook approach in v0.1 is unreliable on Windows — it fires correctly the first time but Claude Code in VS Code spawns sessions in ways that sometimes skip it. Use the Startup-folder method below instead. The hook script is kept for power users.

If you still want to try it (opt-in only):

```powershell
.\scripts\enable-autostart.ps1
```

To disable later:

```powershell
.\scripts\enable-autostart.ps1 -disable
```

### Auto-launch on Windows boot (alternative)

Use this if you want the widget up even before Claude Code launches:

1. `Win+R` → `shell:startup` → Enter
2. Copy `launch.bat` into that folder (or make a shortcut to it)

---

## Troubleshooting

### "Fetch error — server down" in the widget

The Node server died. Open `widget/pulse.log` to see why. Usually means port 7456 is taken — kill whatever is on it:

```powershell
netstat -ano | findstr 7456
taskkill /F /PID <pid>
```

### Widget shows 0% forever

Most likely: no Claude Code session JSONL exists at `~/.claude/projects/`. Open Claude Code, send one message, and the widget will populate within 2 seconds.

### Chrome extension dot stays orange

You haven't visited `claude.ai/settings/usage` since installing the extension. Visit it once and refresh the widget (↻ button top-right).

### Wrong numbers / numbers don't match claude.ai

Two reasons:

1. **ccusage estimate vs Anthropic's weighted formula**: the orange dot means "ccusage estimate" — these will diverge by 5–20% from Anthropic's number, which uses a private weighted formula across models. Install the Chrome extension to see the official %.
2. **Multiple Claude accounts**: the widget shows whichever account Claude Code is currently logged into. If you switch accounts via `claude /login`, restart the widget.

---

## Uninstall

Delete the `claude-pulse` folder. That's it. There's no installer, no registry entries, no background services.

If you also want to remove the Chrome extension:
- `chrome://extensions` → find "Claude Pulse Bridge" → Remove
