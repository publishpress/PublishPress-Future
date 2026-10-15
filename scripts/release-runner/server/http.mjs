import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
import { runCli, commands } from '../cli.mjs';
import { buildStatusPayload } from '../engine/engine.mjs';
import { loadCurrentRelease } from '../state/store.mjs';
import { loadUiPrefs, saveUiPrefs } from '../state/ui-prefs.mjs';
import { Context } from '../engine/context.mjs';
import { publishLog, subscribe } from './events.mjs';
import { loadRunnerPresets } from '../detect-edition.mjs';
import { buildPresetMetaPayload } from '../presets/meta.mjs';
import {
  beginRunSession,
  endRunSession,
  requestShutdown,
  requestStopRun,
  setShutdownHandler,
} from '../run-control.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const UI_DIST = join(__dirname, '../ui/dist');
const HOST = '127.0.0.1';
const PORT = Number(process.env.RELEASE_RUNNER_PORT || 9876);

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
};

/**
 * @param {import('http').IncomingMessage} req
 */
async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * @param {import('http').ServerResponse} res
 * @param {number} code
 * @param {object} body
 */
function json(res, code, body) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

/** @type {{ cwd: string, at: number, value: string | null } | null} */
let ghAccountCache = null;
const GH_ACCOUNT_TTL_MS = 60_000;

/**
 * @param {string} cwd
 */
async function ghAccount(cwd) {
  const now = Date.now();
  if (ghAccountCache && ghAccountCache.cwd === cwd && now - ghAccountCache.at < GH_ACCOUNT_TTL_MS) {
    return ghAccountCache.value;
  }
  const ctx = new Context({}, { cwd });
  const result = await ctx.execCapture('gh auth status 2>&1', { quiet: true });
  const match = result.stdout.match(/Logged in to \S+ account (\S+)/);
  const value = match ? match[1] : null;
  ghAccountCache = { cwd, at: now, value };
  return value;
}

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 * @param {string} cwd
 */
async function handleApi(req, res, cwd) {
  const url = new URL(req.url || '/', `http://${HOST}`);
  const path = url.pathname;

  if (req.method === 'GET' && path === '/api/status') {
    const runnerPresets = loadRunnerPresets(cwd);
    const defaultPreset = runnerPresets[0];
    const presetMeta = buildPresetMetaPayload(runnerPresets);
    const release = loadCurrentRelease(cwd);
    if (!release) {
      json(res, 200, {
        ok: true,
        release: null,
        runnerPresets,
        presetMeta,
        defaultPreset,
        ghAccount: await ghAccount(cwd),
      });
      return;
    }
    const payload = buildStatusPayload(release, release.edition);
    json(res, 200, {
      ok: true,
      ghAccount: await ghAccount(cwd),
      runnerPresets,
      presetMeta,
      defaultPreset,
      ...payload,
    });
    return;
  }

  if (req.method === 'GET' && path === '/api/log') {
    const logPath = join(cwd, 'dev-workspace-cache/deploy.log');
    let log = '';
    if (existsSync(logPath)) {
      log = readFileSync(logPath, 'utf8');
    }
    json(res, 200, { ok: true, log });
    return;
  }

  if (req.method === 'GET' && path === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write('\n');
    const send = (data) => {
      const lines = data.split('\n').filter(Boolean);
      for (const line of lines) {
        res.write(`data: ${JSON.stringify({ line })}\n\n`);
      }
    };
    const unsub = subscribe(send);
    req.on('close', () => unsub());
    return;
  }

  if (req.method === 'POST' && path === '/api/ui-prefs') {
    try {
      json(res, 200, { ok: true, prefs: saveUiPrefs(await readBody(req), cwd) });
    } catch (err) {
      json(res, 400, { ok: false, error: err.message });
    }
    return;
  }

  if (req.method === 'POST' && path === '/api/stop') {
    requestStopRun();
    publishLog('Stopped by user.\n');
    json(res, 200, { ok: true, stopped: true });
    return;
  }

  if (req.method === 'POST' && path === '/api/shutdown') {
    json(res, 200, { ok: true });
    res.on('finish', () => {
      setImmediate(requestShutdown);
    });
    return;
  }

  if (req.method !== 'POST' || !path.startsWith('/api/')) {
    json(res, 404, { ok: false, error: 'Not found' });
    return;
  }

  const body = await readBody(req);
  const args = body.args || [];
  const sub = path.replace(/^\/api\//, '');

  const handler = commands[sub];
  if (!handler) {
    json(res, 404, { ok: false, error: `Unknown API: ${sub}` });
    return;
  }

  const flags = {
    json: false,
    yes: body.yes === true,
    onLog: (line) => publishLog(line),
  };
  const rest = args;
  beginRunSession();
  try {
    const exitCode = await handler(rest, cwd, flags);
    const release = loadCurrentRelease(cwd);
    let error;
    if (release && exitCode === 1) {
      for (const step of Object.values(release.steps)) {
        if (step.status === 'failed' && step.note) {
          error = step.note;
          break;
        }
      }
    }
    json(res, 200, {
      ok: exitCode === 0 || exitCode === 10 || exitCode === 130,
      exitCode,
      release,
      ...(exitCode === 130 ? { stopped: true, error: "Stopped by user" } : {}),
      ...(error ? { error } : {}),
    });
  } catch (err) {
    json(res, 400, { ok: false, error: err.message });
  } finally {
    endRunSession();
  }
}

/**
 * index.html with the saved theme stamped on <html>, so the page paints in it from the start.
 *
 * @param {import('http').ServerResponse} res
 * @param {string} cwd
 */
function serveIndex(res, cwd) {
  const { theme } = loadUiPrefs(cwd);
  let html = readFileSync(join(UI_DIST, 'index.html'), 'utf8');
  if (theme) {
    html = html.replace(/<html\b/, `<html data-theme="${theme}"`);
  }
  res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' });
  res.end(html);
}

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 * @param {string} cwd
 */
function serveStatic(req, res, cwd) {
  let reqPath = new URL(req.url || '/', `http://${HOST}`).pathname;
  if (reqPath === '/') {
    reqPath = '/index.html';
  }
  const filePath = join(UI_DIST, reqPath);
  if (reqPath === '/index.html' || !filePath.startsWith(UI_DIST) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    if (existsSync(join(UI_DIST, 'index.html'))) {
      serveIndex(res, cwd);
      return;
    }
    res.writeHead(404);
    res.end('UI not built. Run: npm run build:release-ui');
    return;
  }
  const ext = extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  res.end(readFileSync(filePath));
}

/**
 * @param {{ cwd?: string }} [options]
 */
export function startServer(options = {}) {
  const cwd = options.cwd || process.cwd();
  const server = createServer(async (req, res) => {
    try {
      if (req.url?.startsWith('/api/')) {
        await handleApi(req, res, cwd);
      } else {
        serveStatic(req, res, cwd);
      }
    } catch (err) {
      json(res, 500, { ok: false, error: err.message });
    }
  });

  setShutdownHandler(() => {
    if (typeof server.closeAllConnections === 'function') {
      server.closeAllConnections();
    }
    server.close(() => {
      process.exit(0);
    });
    const fallback = setTimeout(() => process.exit(0), 1000);
    fallback.unref();
  });

  server.listen(PORT, HOST, () => {
    process.stderr.write(
      `Release runner UI: http://${HOST}:${PORT}/ (cwd: ${cwd})\n`
    );
  });
  return server;
}
