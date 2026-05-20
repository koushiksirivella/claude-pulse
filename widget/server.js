// Claude Pulse local server — v2 (background cache, never blocks)
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const os = require('os');

const PORT = 7456;
const ROOT = __dirname;
const CCUSAGE_REFRESH_MS = 15_000;   // run ccusage at most this often
const CONTEXT_REFRESH_MS = 1_500;    // session JSONL is fast — poll often

// ── In-memory cache filled by background workers ──
let cache = {
  block: null,
  latestSession: null,
  context: null,
  processes: [],
  anthropic: null,        // posted by Chrome extension
  anthropicAt: 0,
  lastCcusageAt: 0,
  errors: [],
};

function logErr(scope, e) {
  const msg = `[${new Date().toISOString()}] ${scope}: ${e?.message || e}`;
  cache.errors = [msg, ...cache.errors].slice(0, 20);
  console.error(msg);
}

// ── ccusage runner ──
function runCcusage(args, timeoutMs = 12_000) {
  return new Promise((resolve) => {
    const p = spawn('npx', ['-y', 'ccusage@latest', ...args, '--json'], {
      shell: true, windowsHide: true,
    });
    let out = '';
    p.stdout.on('data', d => out += d);
    p.stderr.on('data', () => {});
    const t = setTimeout(() => { try { p.kill(); } catch {} resolve(null); }, timeoutMs);
    p.on('close', () => {
      clearTimeout(t);
      try { resolve(JSON.parse(out)); } catch { resolve(null); }
    });
    p.on('error', (e) => { clearTimeout(t); logErr('ccusage spawn', e); resolve(null); });
  });
}

async function refreshCcusage() {
  try {
    const [active, sessions] = await Promise.all([
      runCcusage(['blocks', '--active']),
      runCcusage(['session']),
    ]);
    if (active?.blocks?.[0]) cache.block = active.blocks[0];
    if (sessions?.session?.length) cache.latestSession = sessions.session.slice(-1)[0];
    cache.lastCcusageAt = Date.now();
  } catch (e) { logErr('refreshCcusage', e); }
}

// ── Context window (read JSONL) ──
function refreshContext() {
  try {
    const projects = path.join(os.homedir(), '.claude', 'projects');
    if (!fs.existsSync(projects)) { cache.context = null; return; }
    let latest = null;
    for (const dir of fs.readdirSync(projects)) {
      const full = path.join(projects, dir);
      if (!fs.statSync(full).isDirectory()) continue;
      for (const f of fs.readdirSync(full)) {
        if (!f.endsWith('.jsonl')) continue;
        const fp = path.join(full, f);
        const m = fs.statSync(fp).mtimeMs;
        if (!latest || m > latest.m) latest = { fp, m, project: dir, sid: f.replace('.jsonl', '') };
      }
    }
    if (!latest) { cache.context = null; return; }

    // Read only last ~64 KB to find most-recent assistant usage block
    const stat = fs.statSync(latest.fp);
    const readFrom = Math.max(0, stat.size - 65_536);
    const fd = fs.openSync(latest.fp, 'r');
    const buf = Buffer.alloc(stat.size - readFrom);
    fs.readSync(fd, buf, 0, buf.length, readFrom);
    fs.closeSync(fd);
    const lines = buf.toString('utf8').split('\n').filter(Boolean);

    let usage = null, cwd = null;
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const v = JSON.parse(lines[i]);
        if (v.type === 'assistant' && v.message?.usage) {
          usage = v.message.usage;
          cwd = v.cwd || null;
          break;
        }
      } catch {}
    }
    if (!usage) { cache.context = null; return; }
    const total = (usage.input_tokens||0) + (usage.output_tokens||0) +
                  (usage.cache_creation_input_tokens||0) + (usage.cache_read_input_tokens||0);
    cache.context = {
      session_id: latest.sid,
      project: latest.project,
      cwd,
      input: usage.input_tokens || 0,
      output: usage.output_tokens || 0,
      cache_creation: usage.cache_creation_input_tokens || 0,
      cache_read: usage.cache_read_input_tokens || 0,
      total_context: total,
      pct_of_200k: (total / 200_000) * 100,
    };
  } catch (e) { logErr('refreshContext', e); }
}

// ── Processes ──
function refreshProcesses() {
  try {
    if (os.platform() !== 'win32') return;
    const out = execSync('tasklist /FI "IMAGENAME eq claude.exe" /FO CSV /NH', { encoding: 'utf8', timeout: 3000 });
    cache.processes = out.split('\n')
      .filter(l => l.includes('claude'))
      .map(line => {
        const parts = line.replace(/"/g, '').split(',');
        return {
          name: parts[0],
          pid: parseInt(parts[1]),
          mem_mb: parseInt((parts[4]||'').replace(/[^\d]/g, '')) / 1024,
        };
      });
  } catch (e) { logErr('refreshProcesses', e); }
}

// ── Background loops ──
setInterval(refreshCcusage, CCUSAGE_REFRESH_MS);
setInterval(refreshContext, CONTEXT_REFRESH_MS);
setInterval(refreshProcesses, 5000);
refreshCcusage(); refreshContext(); refreshProcesses();

// ── HTTP server (responds instantly from cache) ──
http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }

  const url = req.url;

  if (url.startsWith('/api/anthropic-usage') && req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (parsed.source === 'dom' && parsed.data &&
            (parsed.data.current_session != null || parsed.data.weekly != null)) {
          cache.anthropic = parsed.data;
          cache.anthropicAt = Date.now();
        }
      } catch {}
      res.statusCode = 204; res.end();
    });
    return;
  }

  if (url.startsWith('/api/usage')) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify({
      block: cache.block,
      latestSession: cache.latestSession,
      context: cache.context,
      processes: cache.processes,
      anthropic: cache.anthropic,
      anthropicAgeMs: cache.anthropic ? (Date.now() - cache.anthropicAt) : null,
      lastCcusageAgeMs: cache.lastCcusageAt ? (Date.now() - cache.lastCcusageAt) : null,
      ts: Date.now(),
    }));
    return;
  }

  if (url === '/api/health') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true, uptime: process.uptime(), errors: cache.errors }));
    return;
  }

  // Static files
  let file = url === '/' ? 'index.html' : url.split('?')[0].slice(1);
  const fp = path.join(ROOT, file);
  if (!fp.startsWith(ROOT) || !fs.existsSync(fp)) {
    res.statusCode = 404; res.end('not found'); return;
  }
  const ext = path.extname(fp).toLowerCase();
  const mime = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.svg':'image/svg+xml' }[ext] || 'text/plain';
  res.setHeader('Content-Type', mime);
  res.end(fs.readFileSync(fp));
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Claude Pulse server live on http://localhost:${PORT}`);
  console.log(`Cache mode: ccusage every ${CCUSAGE_REFRESH_MS}ms, context every ${CONTEXT_REFRESH_MS}ms`);
});

// Don't let uncaught errors kill the process
process.on('uncaughtException', e => logErr('uncaught', e));
process.on('unhandledRejection', e => logErr('unhandledRejection', e));
