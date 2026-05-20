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

## Step 3 — Install the Chrome extension (OPTIONAL — skip if you don't care about exact %)

**Do you need the extension?** No, widget works without it. You'll just see the ccusage *estimate* instead of Anthropic's exact %. Status dot stays ORANGE without extension, turns GREEN with it. Functionally identical.

**If you want the green dot + exact match to claude.ai dashboard, follow below:**

This makes the widget show **REAL** Anthropic usage % (the same number you see at claude.ai/settings/usage), not just the ccusage estimate.

1. Open `chrome://extensions`
2. Toggle **Developer mode** ON (top-right)
3. Click **Load unpacked**
4. Select the `extension/` folder inside this repo
5. Pin the extension to your toolbar (optional)

Then **visit https://claude.ai/settings/usage once**. The extension scrapes the percentage and forwards it to your local widget. After that, your widget status dot turns **GREEN** and the bar shows the official %.

You only need to visit the usage page once per Chrome session — the extension caches the value and keeps replaying it to the widget.

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

To make it auto-launch on Windows boot:

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
