import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { join, resolve } from 'path';
import { getPreset } from '../presets/index.mjs';

/**
 * @param {string} [cwd]
 */
export function getPaths(cwd = process.cwd()) {
  const base = resolve(cwd, 'dev-workspace-cache/releases');
  return {
    base,
    current: join(base, 'current.json'),
    archiveDir: join(base, 'archive'),
    releaseFile: (version) => join(base, `${version}.json`),
    archiveFile: (version) => join(base, 'archive', `${version}.json`),
  };
}

/**
 * @param {string} [cwd]
 * @returns {{ version: string } | null}
 */
export function loadPointer(cwd = process.cwd()) {
  const { current } = getPaths(cwd);
  if (!existsSync(current)) {
    return null;
  }
  try {
    return JSON.parse(readFileSync(current, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * @param {string} version
 * @param {string} [cwd]
 */
export function loadRelease(version, cwd = process.cwd()) {
  const paths = getPaths(cwd);
  const active = paths.releaseFile(version);
  if (existsSync(active)) {
    return JSON.parse(readFileSync(active, 'utf8'));
  }
  const archived = paths.archiveFile(version);
  if (existsSync(archived)) {
    return JSON.parse(readFileSync(archived, 'utf8'));
  }
  return null;
}

/**
 * Ensure every pipeline step has state (e.g. steps added after release started).
 *
 * @param {object} release
 * @returns {{ release: object, changed: boolean }}
 */
export function syncReleaseSteps(release) {
  if (!release?.edition || !release.steps) {
    return { release, changed: false };
  }
  const pipeline = getPreset(release.edition);
  let changed = false;
  for (const def of pipeline) {
    if (!release.steps[def.id]) {
      release.steps[def.id] = { status: 'pending' };
      changed = true;
    }
  }
  if (changed) {
    touchRelease(release);
  }
  return { release, changed };
}

export function loadCurrentRelease(cwd = process.cwd()) {
  const pointer = loadPointer(cwd);
  if (!pointer?.version) {
    return null;
  }
  const release = loadRelease(pointer.version, cwd);
  if (!release) {
    return null;
  }
  const synced = syncReleaseSteps(release);
  if (synced.changed) {
    saveRelease(synced.release, cwd);
  }
  return synced.release;
}

/**
 * @param {object} release
 * @param {string} [cwd]
 */
export function saveRelease(release, cwd = process.cwd()) {
  const paths = getPaths(cwd);
  mkdirSync(paths.base, { recursive: true });
  writeFileSync(paths.releaseFile(release.version), JSON.stringify(release, null, 2), 'utf8');
  if (release.status === 'in_progress') {
    writeFileSync(paths.current, JSON.stringify({ version: release.version }, null, 2), 'utf8');
  }
}

/**
 * @param {string} [cwd]
 */
export function deleteCurrentRelease(cwd = process.cwd()) {
  const paths = getPaths(cwd);
  const pointer = loadPointer(cwd);
  if (pointer?.version) {
    const file = paths.releaseFile(pointer.version);
    if (existsSync(file)) {
      unlinkSync(file);
    }
  }
  if (existsSync(paths.current)) {
    unlinkSync(paths.current);
  }
}

/**
 * @param {object} release
 * @param {string} [cwd]
 */
export function archiveRelease(release, cwd = process.cwd()) {
  const paths = getPaths(cwd);
  mkdirSync(paths.archiveDir, { recursive: true });
  const record = { ...release, status: 'abandoned' };
  writeFileSync(paths.archiveFile(release.version), JSON.stringify(record, null, 2), 'utf8');
  const active = paths.releaseFile(release.version);
  if (existsSync(active)) {
    unlinkSync(active);
  }
  if (existsSync(paths.current)) {
    unlinkSync(paths.current);
  }
}

/**
 * @param {import('../presets/types.mjs').StepDefinition[]} stepDefs
 */
export function buildInitialSteps(stepDefs) {
  /** @type {Record<string, { status: string, at?: string, note?: string }>} */
  const steps = {};
  for (const def of stepDefs) {
    steps[def.id] = { status: 'pending' };
  }
  return steps;
}

/**
 * @param {string} version
 * @param {'free'|'pro'} edition
 * @param {'standard'|'security'} urgency
 * @param {import('../presets/types.mjs').StepDefinition[]} stepDefs
 * @param {{ channel?: 'beta'|'rc' } | null} prerelease
 */
export function createReleaseRecord(version, edition, urgency, stepDefs, prerelease = null) {
  const branchName = `release-${version.replace(/-(beta|rc)\.\d+$/, '')}`;
  return {
    version,
    edition,
    urgency,
    branchName,
    status: 'in_progress',
    prerelease: prerelease ? { channel: prerelease.channel, n: 1 } : null,
    steps: buildInitialSteps(stepDefs),
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * @param {object} release
 */
export function touchRelease(release) {
  release.updatedAt = new Date().toISOString();
  return release;
}

/**
 * @param {string} [cwd]
 */
export function listReleaseIds(cwd = process.cwd()) {
  const paths = getPaths(cwd);
  const current = loadPointer(cwd);
  /** @type {{ current: string | null, active: string[], archived: string[] }} */
  const result = { current: current?.version ?? null, active: [], archived: [] };
  if (existsSync(paths.base)) {
    for (const name of readdirSync(paths.base)) {
      if (name.endsWith('.json') && name !== 'current.json') {
        result.active.push(name.replace(/\.json$/, ''));
      }
    }
  }
  if (existsSync(paths.archiveDir)) {
    for (const name of readdirSync(paths.archiveDir)) {
      if (name.endsWith('.json')) {
        result.archived.push(name.replace(/\.json$/, ''));
      }
    }
  }
  return result;
}

/**
 * @param {object} release
 */
export function resolveEffectiveVersion(release) {
  if (!release.prerelease?.channel) {
    return release.version.replace(/-(beta|rc)\.\d+$/, '') === release.version
      ? release.version
      : release.version;
  }
  const base = release.version.replace(/-(beta|rc)\.\d+$/, '');
  return `${base}-${release.prerelease.channel}.${release.prerelease.n}`;
}
