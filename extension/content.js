// Claude Pulse Bridge — content script
// Scrapes claude.ai usage % on /settings/usage and remembers it via chrome.storage
// Even when user navigates away, last known values keep getting posted to Pulse server

const PULSE_ENDPOINT = 'http://localhost:7456/api/anthropic-usage';
const POLL_INTERVAL_MS = 5000;
const STORAGE_KEY = 'pulse_anthropic_cache';

// ─── 1. Intercept usage-related XHR/fetch responses (when on relevant pages) ───
(function patchFetch() {
  const orig = window.fetch;
  window.fetch = async function(...args) {
    const resp = await orig.apply(this, args);
    try {
      const url = (typeof args[0] === 'string') ? args[0] : args[0].url;
      if (url && /usage|rate.?limit|account|organization/i.test(url)) {
        const clone = resp.clone();
        clone.json().then(json => {
          postToPulse({ source: 'fetch', url, data: json });
        }).catch(() => {});
      }
    } catch {}
    return resp;
  };

  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    this._pulseUrl = url;
    return origOpen.call(this, method, url, ...rest);
  };
  XMLHttpRequest.prototype.send = function(body) {
    this.addEventListener('load', () => {
      try {
        const u = this._pulseUrl || '';
        if (/usage|rate.?limit|account|organization/i.test(u)) {
          try {
            const json = JSON.parse(this.responseText);
            postToPulse({ source: 'xhr', url: u, data: json });
          } catch {}
        }
      } catch {}
    });
    return origSend.call(this, body);
  };
})();

// ─── 2. DOM scraper ───
function scrapeDom() {
  const result = { current_session: null, weekly: null, session_resets_in: null, weekly_resets: null, plan: null };
  try {
    const allText = document.body.innerText || '';
    const planMatch = allText.match(/Plan usage limits\s+(Pro|Max|Team|Enterprise)/i);
    if (planMatch) result.plan = planMatch[1];

    const sessionMatch = allText.match(/Current session[\s\S]{0,200}?(\d{1,3})%/i);
    if (sessionMatch) result.current_session = parseInt(sessionMatch[1]);

    const resetMatch = allText.match(/Resets in\s+(\d+\s*hr\s*\d+\s*min)/i);
    if (resetMatch) result.session_resets_in = resetMatch[1];

    const weeklyMatch = allText.match(/All models[\s\S]{0,200}?(\d{1,3})%/i);
    if (weeklyMatch) result.weekly = parseInt(weeklyMatch[1]);

    const weekReset = allText.match(/Resets\s+(\w+\s+\d{1,2}:\d{2}\s*(?:AM|PM))/i);
    if (weekReset) result.weekly_resets = weekReset[1];
  } catch (e) { result.error = String(e); }
  return result;
}

// ─── 3. Post to Pulse server ───
function postToPulse(payload) {
  payload.ts = Date.now();
  payload.path = location.pathname;
  fetch(PULSE_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

// ─── 4. Memory: save fresh scrape to storage, then keep replaying it ───
async function tryScrapeAndStore() {
  const dom = scrapeDom();
  if (dom.current_session != null || dom.weekly != null) {
    // Got real data — save + post
    try {
      await chrome.storage.local.set({
        [STORAGE_KEY]: { data: dom, scrapedAt: Date.now(), origin: location.pathname }
      });
    } catch {}
    postToPulse({ source: 'dom', data: dom });
    return true;
  }
  return false;
}

async function replayFromStorage() {
  try {
    const obj = await chrome.storage.local.get(STORAGE_KEY);
    const cached = obj[STORAGE_KEY];
    if (cached && cached.data) {
      // Re-post the cached data so server thinks it's fresh
      postToPulse({ source: 'dom', data: cached.data, replayed: true, originalAge: Date.now() - cached.scrapedAt });
      return true;
    }
  } catch {}
  return false;
}

async function tick() {
  const scraped = await tryScrapeAndStore();
  if (!scraped) {
    // Not on a page with usage data — replay last known good
    await replayFromStorage();
  }
}

tick();
setInterval(tick, POLL_INTERVAL_MS);

// Re-scrape when the page mutates (SPA navigation, dashboard refresh)
const obs = new MutationObserver(() => { tryScrapeAndStore(); });
obs.observe(document.body, { childList: true, subtree: true, characterData: true });

console.log('[Claude Pulse Bridge v0.2] active — scrape + remember + replay');
