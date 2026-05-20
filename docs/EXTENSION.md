# Optional: Chrome Extension (advanced)

The default Claude Pulse install reads your local Claude Code session JSONL files and runs `ccusage` to compute usage. **Every absolute number is exact** — tokens, $ cost, context window %.

The only thing slightly approximate is the **5-hour block % bar** and **weekly limit % bar** — these can differ by 5–10% from what `claude.ai/settings/usage` shows, because Anthropic applies a private weighted formula across models (Opus tokens count more than Sonnet, cache reads count differently).

If you want the % bars to match the official dashboard exactly, install the optional Chrome bridge extension.

---

## Should you bother?

**Skip the extension if:**
- You watch absolute numbers (tokens, $, burn rate) — those are already exact
- You're a casual user who just wants visibility
- You don't want to enable Chrome Developer Mode

**Install the extension if:**
- You want bar % to exactly match `claude.ai/settings/usage`
- You're a Max-plan power-user pushing the limit daily
- You need precise rate-limit projections

---

## Install (Dev Mode, free)

1. Open `chrome://extensions`
2. Toggle **Developer mode** ON (top-right)
3. Click **Load unpacked**
4. Select the `extension/` folder from this repo
5. Visit `https://claude.ai/settings/usage` once
6. Widget status dot turns **GREEN** = exact data flowing

You only need to visit the usage page once per Chrome session — the extension caches the value and keeps replaying it to the widget.

---

## Coming in v0.2: One-click Chrome Web Store install

For v0.1 we use Dev Mode (free, 5 clicks). v0.2 will publish to the Chrome Web Store — single "Add to Chrome" button, no Dev Mode warnings.

If you'd rather wait, just use the default ccusage path. You're not missing much.
