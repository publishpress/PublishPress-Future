import {
  archiveRelease,
  createReleaseRecord,
  deleteCurrentRelease,
  loadCurrentRelease,
  saveRelease,
  listReleaseIds,
  syncReleaseSteps,
  touchRelease,
} from './state/store.mjs';
import {
  buildStatusPayload,
  cascadeReopen,
  runEngine,
} from './engine/engine.mjs';
import {
  getPreset,
  getPresetMeta,
  validateVersionForPreset,
} from './presets/index.mjs';
import { resolveStartPreset } from './detect-edition.mjs';
import { maxPrereleaseNumber } from './state/store.mjs';

/**
 * @param {string[]} argv
 */
function parseGlobalFlags(argv) {
  const flags = { json: false, yes: false };
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') {
      flags.json = true;
    } else if (arg === '--yes') {
      flags.yes = true;
    } else {
      rest.push(arg);
    }
  }
  return { flags, rest };
}

/**
 * @param {object} payload
 * @param {boolean} json
 */
function output(payload, json) {
  if (json) {
    process.stdout.write(`${JSON.stringify(payload)}\n`);
  } else if (payload.message) {
    process.stderr.write(`${payload.message}\n`);
  }
}

/**
 * @param {{ exitCode: number, blocked?: string, error?: string, release: object }} result
 */
function formatRunPayload(result) {
  return {
    ok: result.exitCode !== 1,
    exitCode: result.exitCode,
    ...(result.blocked ? { blocked: result.blocked } : {}),
    ...(result.error ? { error: result.error } : {}),
    release: result.release,
  };
}

/**
 * @param {{ exitCode: number }} result
 */
function exitFromRunResult(result) {
  return result.exitCode === 1 ? 1 : 0;
}

/**
 * @param {string} cwd
 * @param {{ onLog?: (line: string) => void, until?: string, confirm?: string }} [options]
 */
async function continueRelease(cwd, options = {}) {
  const release = loadCurrentRelease(cwd);
  if (!release) {
    throw new Error('No in-progress release');
  }
  return runEngine(release, { cwd, ...options });
}

/**
 * @param {string[]} rest
 * @param {string} cwd
 * @param {{ json: boolean }} flags
 */
async function cmdStart(rest, cwd, flags) {
  const version = rest[0];
  if (!version) {
    throw new Error(
      'Usage: start <version> [--preset <id>] [--edition <id>] [--urgency standard|security] [--prerelease-channel beta|rc]'
    );
  }
  let presetExplicit = false;
  /** @type {string | null} */
  let presetArg = null;
  let urgency = 'standard';
  /** @type {'beta'|'rc'|null} */
  let prereleaseChannel = null;
  for (let i = 1; i < rest.length; i += 1) {
    if ((rest[i] === '--preset' || rest[i] === '--edition') && rest[i + 1]) {
      presetArg = rest[i + 1];
      presetExplicit = true;
      i += 1;
    } else if (rest[i] === '--urgency' && rest[i + 1]) {
      urgency = rest[i + 1];
      i += 1;
    } else if (rest[i] === '--prerelease-channel' && rest[i + 1]) {
      prereleaseChannel = rest[i + 1];
      i += 1;
    } else if (rest[i] === '--channel' && rest[i + 1]) {
      throw new Error('Use --prerelease-channel instead of --channel');
    }
  }
  const edition = resolveStartPreset(cwd, presetExplicit ? presetArg : null);
  validateVersionForPreset(version, edition);
  const meta = getPresetMeta(edition);
  /** @type {{ channel: 'beta'|'rc', n: number } | null} */
  let prerelease = null;
  if (meta.versionRule === 'prerelease') {
    const channels = meta.channels || ['beta'];
    const channel = prereleaseChannel || channels[0];
    if (!channels.includes(channel)) {
      throw new Error(
        `Invalid --prerelease-channel "${channel}". Allowed for ${edition}: ${channels.join(', ')}`
      );
    }
    const n = maxPrereleaseNumber(cwd, version, channel) + 1;
    prerelease = { channel, n };
  } else if (prereleaseChannel) {
    throw new Error(`--prerelease-channel is not used with stable preset ${edition}`);
  }
  const existing = loadCurrentRelease(cwd);
  if (existing?.status === 'in_progress') {
    throw new Error(`Release v${existing.version} is already in progress`);
  }
  const steps = getPreset(edition);
  const release = createReleaseRecord(version, edition, urgency, steps, prerelease);
  saveRelease(release, cwd);
  const result = await continueRelease(cwd, { onLog: flags.onLog });
  output(
    {
      started: true,
      ...formatRunPayload(result),
      ...(presetExplicit ? {} : { presetResolved: edition }),
    },
    flags.json
  );
  return exitFromRunResult(result);
}

/**
 * @param {string} cwd
 * @param {{ json: boolean }} flags
 */
async function cmdResume(cwd, flags) {
  const release = loadCurrentRelease(cwd);
  if (!release) {
    throw new Error('No in-progress release. Run start first.');
  }
  output({ ok: true, release }, flags.json);
  return 0;
}

/**
 * @param {string[]} rest
 * @param {string} cwd
 * @param {{ json: boolean, yes: boolean }} flags
 */
async function cmdReset(rest, cwd, flags) {
  if (!flags.yes && rest[0] !== '--yes') {
    throw new Error('reset requires --yes');
  }
  deleteCurrentRelease(cwd);
  output({ ok: true, reset: true }, flags.json);
  return 0;
}

/**
 * @param {string[]} rest
 * @param {string} cwd
 * @param {{ json: boolean }} flags
 */
async function cmdNew(rest, cwd, flags) {
  const startArgs = rest;
  const current = loadCurrentRelease(cwd);
  if (current) {
    archiveRelease(current, cwd);
  }
  return cmdStart(startArgs, cwd, flags);
}

/**
 * @param {string} cwd
 * @param {{ json: boolean }} flags
 */
async function cmdList(cwd, flags) {
  output({ ok: true, releases: listReleaseIds(cwd) }, flags.json);
  return 0;
}

/**
 * @param {string} cwd
 * @param {{ json: boolean }} flags
 */
async function cmdStatus(cwd, flags) {
  const release = loadCurrentRelease(cwd);
  if (!release) {
    output({ ok: true, release: null }, flags.json);
    return 0;
  }
  const payload = buildStatusPayload(release, release.edition);
  output({ ok: true, ...payload }, flags.json);
  return 0;
}

/**
 * @param {string} stepId
 * @param {string} cwd
 * @param {string} [note]
 */
function markStep(release, stepId, status, note, cwd) {
  const { changed } = syncReleaseSteps(release);
  if (changed) {
    saveRelease(release, cwd);
  }
  if (!release.steps[stepId]) {
    throw new Error(`Unknown step: ${stepId}`);
  }
  release.steps[stepId] = {
    status,
    at: new Date().toISOString(),
    ...(note ? { note } : {}),
  };
  touchRelease(release);
  saveRelease(release, cwd);
}

/**
 * @param {string[]} rest
 * @param {string} cwd
 * @param {{ json: boolean }} flags
 */
async function cmdComplete(rest, cwd, flags) {
  const stepId = rest[0];
  let note;
  for (let i = 1; i < rest.length; i += 1) {
    if (rest[i] === '--note' && rest[i + 1]) {
      note = rest[i + 1];
      i += 1;
    }
  }
  const release = loadCurrentRelease(cwd);
  if (!release) {
    throw new Error('No in-progress release');
  }
  markStep(release, stepId, 'done', note, cwd);
  const result = await continueRelease(cwd, { onLog: flags.onLog });
  output(formatRunPayload(result), flags.json);
  return exitFromRunResult(result);
}

/**
 * @param {string[]} rest
 * @param {string} cwd
 * @param {{ json: boolean }} flags
 */
async function cmdSkip(rest, cwd, flags) {
  const stepId = rest[0];
  if (stepId === 'github_auth') {
    throw new Error('github_auth cannot be skipped');
  }
  let note;
  for (let i = 1; i < rest.length; i += 1) {
    if (rest[i] === '--note' && rest[i + 1]) {
      note = rest[i + 1];
      i += 1;
    }
  }
  const release = loadCurrentRelease(cwd);
  if (!release) {
    throw new Error('No in-progress release');
  }
  markStep(release, stepId, 'skipped', note, cwd);
  const result = await continueRelease(cwd, { onLog: flags.onLog });
  output(formatRunPayload(result), flags.json);
  return exitFromRunResult(result);
}

/**
 * @param {string[]} rest
 * @param {string} cwd
 * @param {{ json: boolean }} flags
 */
async function cmdReopen(rest, cwd, flags) {
  const stepId = rest[0];
  const release = loadCurrentRelease(cwd);
  if (!release) {
    throw new Error('No in-progress release');
  }
  cascadeReopen(release, stepId, release.edition);
  saveRelease(release, cwd);
  const result = await continueRelease(cwd, { onLog: flags.onLog });
  output(formatRunPayload(result), flags.json);
  return exitFromRunResult(result);
}

/**
 * @param {string[]} rest
 * @param {string} cwd
 * @param {{ json: boolean }} flags
 */
async function cmdRun(rest, cwd, flags) {
  let until;
  let confirm;
  for (let i = 0; i < rest.length; i += 1) {
    if (rest[i] === '--until' && rest[i + 1]) {
      until = rest[i + 1];
      i += 1;
    } else if (rest[i] === '--confirm' && rest[i + 1]) {
      confirm = rest[i + 1];
      i += 1;
    }
  }
  const result = await continueRelease(cwd, { until, confirm, onLog: flags.onLog });
  output(formatRunPayload(result), flags.json);
  return result.exitCode;
}

/** @type {Record<string, (rest: string[], cwd: string, flags: { json: boolean, yes: boolean, onLog?: (line: string) => void }) => Promise<number>>} */
export const commands = {
  start: cmdStart,
  resume: (rest, cwd, flags) => cmdResume(cwd, flags),
  reset: cmdReset,
  new: cmdNew,
  list: (rest, cwd, flags) => cmdList(cwd, flags),
  status: (rest, cwd, flags) => cmdStatus(cwd, flags),
  complete: cmdComplete,
  skip: cmdSkip,
  reopen: cmdReopen,
  run: cmdRun,
};

/**
 * @param {string[]} argv
 * @param {{ cwd?: string }} [options]
 */
export async function runCli(argv, options = {}) {
  const cwd = options.cwd || process.cwd();
  const { flags, rest } = parseGlobalFlags(argv);
  const sub = rest[0];
  if (!sub || sub === '--help' || sub === '-h') {
    process.stderr.write(
      'Usage: release-runner <start|resume|reset|new|list|status|complete|skip|reopen|run> [options]\n'
    );
    return sub ? 0 : 1;
  }
  const handler = commands[sub];
  if (!handler) {
    throw new Error(`Unknown subcommand: ${sub}`);
  }
  try {
    return await handler(rest.slice(1), cwd, flags);
  } catch (err) {
    output({ ok: false, error: err.message }, flags.json);
    if (!flags.json) {
      process.stderr.write(`${err.message}\n`);
    }
    return 1;
  }
}
