import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { join, resolve } from 'path';
import { getPreset, normalizeEdition } from '../presets/index.mjs';

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
  let changed = false;
  const canonicalEdition = normalizeEdition(release.edition);
  if (canonicalEdition !== release.edition) {
    release.edition = canonicalEdition;
    changed = true;
  }
  const pipeline = getPreset(release.edition);
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
 * @param {import('../presets/index.mjs').ReleaseEditionId | string} edition
 * @param {'standard'|'security'} urgency
 * @param {import('../presets/types.mjs').StepDefinition[]} stepDefs
 * @param {{ channel: 'beta'|'rc', n?: number } | null} prerelease
 */
export function createReleaseRecord(version, edition, urgency, stepDefs, prerelease = null) {
  const branchName = `release-${version.replace(/-(beta|rc)\.\d+$/, '')}`;
  return {
    version,
    edition,
    urgency,
    branchName,
    status: 'in_progress',
    prerelease: prerelease
      ? { channel: prerelease.channel, n: typeof prerelease.n === 'number' ? prerelease.n : 1 }
      : null,
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
 * Highest prerelease build number for a base version and channel in saved release JSON.
 *
 * @param {string} cwd
 * @param {string} baseVersion MAJOR.MINOR.PATCH
 * @param {'beta'|'rc'} channel
 */
export function maxPrereleaseNumber(cwd, baseVersion, channel) {
  const paths = getPaths(cwd);
  /** @type {string[]} */
  const files = [];
  if (existsSync(paths.base)) {
    for (const name of readdirSync(paths.base)) {
      if (name.endsWith('.json') && name !== 'current.json') {
        files.push(join(paths.base, name));
      }
    }
  }
  if (existsSync(paths.archiveDir)) {
    for (const name of readdirSync(paths.archiveDir)) {
      if (name.endsWith('.json')) {
        files.push(join(paths.archiveDir, name));
      }
    }
  }

  let max = 0;
  const suffixRe = new RegExp(`^${baseVersion.replace(/\./g, '\\.')}-${channel}\\.(\\d+)$`);

  for (const filePath of files) {
    try {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      const base = String(data.version || '').replace(/-(beta|rc)\.\d+$/, '');
      if (base !== baseVersion) {
        continue;
      }
      if (data.prerelease?.channel === channel && typeof data.prerelease.n === 'number') {
        max = Math.max(max, data.prerelease.n);
      }
      const m = String(data.version || '').match(suffixRe);
      if (m) {
        max = Math.max(max, Number(m[1]));
      }
    } catch {
      // ignore corrupt files
    }
  }
  return max;
}

export function resolveEffectiveVersion(release) {
  if (!release.prerelease?.channel) {
    return release.version.replace(/-(beta|rc)\.\d+$/, '') === release.version
      ? release.version
      : release.version;
  }
  const base = release.version.replace(/-(beta|rc)\.\d+$/, '');
  return `${base}-${release.prerelease.channel}.${release.prerelease.n}`;
}
