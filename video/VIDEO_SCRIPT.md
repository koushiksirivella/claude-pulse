# Claude Pulse — YouTube Video Script

**Channel:** @koushiksirivella · first long-form video
**Length:** 8:00 target (script is timed at 7:45 + 15s buffer)
**Format:** Faceless, screen + voice. EN primary. Telugu multi-audio later.
**Setup:** Two tabs on screen — `slides.html` (left), VS Code with Claude Code + widget (right).
You click through slides + cut to widget demo on cue.

**Hold for camera:** confident but calm pace. ~155 wpm. Don't rush the hook.

---

## Pre-recording checklist

- [ ] `slides.html` open in Chrome fullscreen (`F` key)
- [ ] VS Code visible in right pane with a fresh Claude Code session
- [ ] Widget pinned top-right (`launch.bat` then `pin-on-top.ps1`)
- [ ] Clean desktop wallpaper (no notifications, no clutter)
- [ ] Mic level checked, no fan/AC noise
- [ ] Caveman extension OFF during pre-pitch, ON during the reveal
- [ ] Repo URL ready to copy: `github.com/koushiksirivella/claude-pulse`

---

## TIMECODE BREAKDOWN

### 0:00 – 0:15 · HOOK (Slide 01)

**Visible:** Slide 01 — "6 problems killing your Claude Code."

**Say:**
> If you're using Claude Code on VS Code, there are six things hiding from you right now. Rate limits. Context window. Token cost split. Session loss. Crashes. And the one you hit every single day — you can't even see your usage without typing a command. I built one free tool that fixes all six. Open source. Thirty-second install. Let me show you.

**Cue:** Advance to Slide 02 on word *"Let me show you."*

---

### 0:15 – 0:35 · WHO + PROMISE (Slide 02)

**Visible:** Slide 02 — solo founder card.

**Say:**
> I'm Koushik. Nineteen. Dropout. India. Building Dynasty Studio publicly. This is the first tool I'm shipping. It's called Claude Pulse. Free forever, MIT license, the link is in the description. Subscribe — I ship one new tool every week.

**Cue:** Advance to Slide 03 on word *"every week."*

---

### 0:35 – 1:10 · THE DAILY PAIN — P6 (Slide 03)

**Visible:** Slide 03 — "You can't see your usage."

**Say:**
> Let me start with the problem you hit every day. To see how much of your Claude Code limit you've burned, you have three options. You type slash-cost. You type slash-context. Or you open the claude-dot-ai dashboard in your browser. You do this thirty, maybe forty times a day. Each time you type one of those commands, you burn a turn. Each time you check the browser, you lose your flow. None of this is glanceable. This is the problem nobody talks about.

**Cue:** Advance to Slide 04 on word *"nobody talks about."*

---

### 1:10 – 1:40 · THE FIX — Widget intro (Slide 04 + cut to widget)

**Visible:** Slide 04 — "Glance. Don't query." Then cut to widget on desktop.

**Say:**
> Or you do this. (CUT TO WIDGET DEMO) This is Claude Pulse. It sits on top of everything. Token count — live. Cost in dollars — live. Context window percent — live. Burn rate per minute — live. I'm not running any commands. I'm not opening any tabs. I'm just glancing.

**Cue:** Cursor → drag widget around, point at burn-rate value. Then back to slides.

---

### 1:40 – 2:15 · P1 — 5h block drain (Slide 05)

**Visible:** Slide 05 — "100% in 90 minutes. No warning."

**Say:**
> Problem one. The five-hour block. Anthropic gives Max users a five-hour usage window. People are hitting one hundred percent of it in ninety minutes. No warning. The first thing you see is the rate-limit error itself. (POINT to widget bar) Pulse shows you the live bar. Burn rate per minute. Bar turns orange at seventy percent. Red at ninety. You see the wall coming, before you hit it.

**Cue:** Advance to Slide 06 on word *"hit it."*

---

### 2:15 – 2:45 · P2 — Context blindness (Slide 06)

**Visible:** Slide 06 — "200k context. Zero indicator."

**Say:**
> Problem two. Two hundred thousand tokens of context, and Claude Code doesn't show you how much you've used. You type slash-context. It burns a turn. The number is stale the next message. (POINT to widget context bar) Pulse reads your session file directly. Updates every one-point-five seconds. Zero turns burned. Always live.

**Cue:** Advance to Slide 07 on word *"Always live."*

---

### 2:45 – 3:15 · P3 — Cost split (Slide 07)

**Visible:** Slide 07 — "Output costs 5× input."

**Say:**
> Problem three. Output tokens cost five times more than input tokens. The default tools show you total cost. They don't show you the split. If you don't know which one is burning, you can't fix it. Pulse shows four cards: input, output, cache-create, cache-read. Per model. Now you know exactly where the money is going.

**Cue:** Advance to Slide 08 on word *"going."*

---

### 3:15 – 3:45 · P4 — Handoff loss (Slide 08)

**Visible:** Slide 08 — "Context wiped. 20 min to re-prime."

**Say:**
> Problem four. VS Code crashes. Slash-resume is broken — multiple GitHub issues open right now. Context gone. You spend twenty minutes retyping what you were working on. Pulse version zero-point-four ships a one-click handoff prompt. Pulls your working directory, branch, files touched, last goal — all from the session JSONL. Paste into a fresh session, you're back.

**Cue:** Advance to Slide 09 on word *"you're back."*

---

### 3:45 – 4:15 · P5 — Crashes (Slide 09)

**Visible:** Slide 09 — "Two claude.exe processes. 2GB RAM."

**Say:**
> Problem five. The Claude Code VS Code extension has a known bug — it spawns two processes, leaks memory up to two gigs, freezes the editor. Pulse version zero-point-four shows a live process list. Warns you when you have dual processes or one that's hung. One click — kill it. Get your editor back.

**Cue:** Advance to Slide 10 on word *"get your editor back."*

---

### 4:15 – 4:40 · P6 RECAP — the unlock (Slide 10)

**Visible:** Slide 10 — "Usage is hidden. The core unlock."

**Say:**
> So those are six problems. Five of them are the moat. Problem six — usage is hidden — that's the daily one. That's why this widget exists. Everything else compounds around it.

**Cue:** Advance to Slide 11 on word *"compounds around it."*

---

### 4:40 – 5:30 · CAVEMAN REVEAL (Slide 11 + live demo)

**Visible:** Slide 11 — caveman stats. Then cut to side-by-side Claude Code demo.

**Say:**
> Now this is the part that changes things. The repo bundles three skills called Caveman. (CUT TO LIVE DEMO) Same question, asked twice. Normal mode (SHOW NORMAL RESPONSE) — about five hundred tokens. Caveman mode (TOGGLE ON, ASK SAME QUESTION) — about one hundred and twenty-five tokens. Same answer. Same correctness. Same code blocks. Seventy-five percent fewer tokens. Three times longer five-hour runway. Zero accuracy lost.

**Cue:** Back to slides. Advance to Slide 12 on word *"lost."*

---

### 5:30 – 5:50 · SEE + ACT PAIRING (Slide 12)

**Visible:** Slide 12 — "Pulse = SEE. Caveman = ACT."

**Say:**
> Pulse shows you when you're burning. Caveman lets you burn slower. See plus act — that's the pair. That's why they ship together.

**Cue:** Advance to Slide 13 on word *"ship together."*

---

### 5:50 – 6:20 · INSTALL (Slide 13 + Slide 14)

**Visible:** Slide 13 — one-paste install.

**Say:**
> Now installing this. Two ways. First way — paste this prompt into your Claude Code. (POINT) Claude clones the repo, runs install dot bat, verifies, tells you when the widget is up. Zero typing.

**Cue:** Advance to Slide 14.

> Second way — manual, three commands. (POINT) Git clone. Cd in. Run install dot bat. Thirty seconds. Widget pops. Pinned on top. Auto-launches every Claude Code session from now on.

**Cue:** Advance to Slide 15 on word *"from now on."*

---

### 6:20 – 7:00 · USE CASES (Slide 15)

**Visible:** Slide 15 — six use cases grid.

**Say:**
> Who is this for. Max-plan power users who burn through blocks. Multi-account devs — widget auto-detects which account you're logged into. Long-session builders who don't want to break flow. VS Code crash victims — version zero-point-four kills your stuck processes. Token-conscious teams who need to know which dev is burning. And anyone who just wants the caveman skills — drop them in, get the savings, skip the widget.

**Cue:** Advance to Slide 16 on word *"skip the widget."*

---

### 7:00 – 7:25 · ROADMAP (Slide 16)

**Visible:** Slide 16 — five-version roadmap.

**Say:**
> Roadmap. Version zero-point-one shipped today — the widget, the skills, the auto-launch hook. Version zero-point-two — native binary, Chrome Web Store. Version zero-point-three — caveman UI built into the widget. Version zero-point-four — handoff and process kill. Version zero-point-five — Mac and Linux builds. All public. All free.

**Cue:** Advance to Slide 17 on word *"All free."*

---

### 7:25 – 7:50 · CTA (Slide 17)

**Visible:** Slide 17 — final CTA card with repo URL.

**Say:**
> Three asks. Star the repo — link is in the description. Clone it, try it for one day. And if something breaks, or you want a feature, open an issue. I read every one. I'll fix what I can next week. Subscribe — I'm shipping one new tool every Friday for the next ninety days. See you in the next one.

**Cue:** End-screen card overlay at 7:50, last 10s.

---

### 7:50 – 8:00 · END SCREEN

Subscribe button left, next-video poster right, link to repo bottom.
No voiceover. Outro music ducks in if you use any.

---

## Caption file (subtitles)

Burn captions in throughout. Bigger font on hook (0:00–0:15) and CTA (7:25–7:50).

Telugu multi-audio: record the same script in Telugu after the EN version is locked. Upload via YouTube Studio → Subtitles → "Add audio track."

---

## What NOT to say (anti-AI-slop guardrails)

- ❌ "Hey guys, what's up, welcome back to the channel"
- ❌ "In today's video we'll be looking at..."
- ❌ "Without further ado..."
- ❌ "If you like this video, smash that like button"
- ❌ Vague claims: "really useful", "super powerful", "a lot of people"
- ❌ Reading numbers without showing them on screen

## What TO say

- ✅ Direct opens: "If you're using Claude Code..."
- ✅ Concrete numbers: "75%", "200k", "30 seconds"
- ✅ Imperatives: "Glance. Don't query." / "Star. Clone. Issue."
- ✅ Cut-to-demo cues — show the widget every time you describe it

---

## Recording order (do in this order, not chronological)

1. **First take = b-roll only.** Record the widget demo (~5 min of widget being used, dragged, watched). Cut snippets later.
2. **Second take = caveman demo.** Side-by-side same question, normal vs caveman.
3. **Third take = install demo.** Real-time clone + install.bat + widget pops. Don't rehearse.
4. **Fourth take = voiceover.** Record start-to-finish in one breath if you can. Read this script.
5. **Fifth pass = edit.** Sync voice to slides + b-roll. Trim filler.

---

## After upload

- Pin a comment with the repo URL + your IG @koushikx.dev
- Reply to every comment in the first hour (algorithm boost)
- Post a 30-second Short cut from the caveman reveal (Slide 11 demo)
- Post the same Short on Instagram + LinkedIn (cross-platform)
- DM the YouTube video link to 10 Claude Code users in r/ClaudeCode (don't spam, share once)

---

## Title options (pick one before upload)

1. **"I built the Claude Code widget Anthropic forgot — in 24 hours"** ← my pick
2. "Your $20 Claude Pro is leaking 75% — here's the fix"
3. "Claude Code has 6 hidden problems. I solved them in one repo."
4. "Why Claude Code burns out in 90 minutes (and the free tool that fixes it)"

## Thumbnail brief

- Left half: dark VS Code window with red "100%" rate-limit error
- Right half: bright widget mockup with green bars
- Big bold text top: **"6 PROBLEMS"** with strike-through → **"SOLVED"**
- Tag bottom-right: **"FREE · OPEN SOURCE"**
