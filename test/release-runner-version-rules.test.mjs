import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateVersionForPreset } from '../scripts/release-runner/presets/meta.mjs';
import {
  createReleaseRecord,
  maxPrereleaseNumber,
  saveRelease,
} from '../scripts/release-runner/state/store.mjs';
import { getPreset, PRESET_PLUGIN_FREE_UNSTABLE } from '../scripts/release-runner/presets/index.mjs';
import { commands } from '../scripts/release-runner/cli.mjs';

test('validateVersionForPreset stable rejects prerelease suffix', () => {
  assert.doesNotThrow(() => validateVersionForPreset('4.11.0', 'plugin-free-stable'));
  assert.throws(
    () => validateVersionForPreset('4.11.0-beta.1', 'plugin-free-stable'),
    /Stable preset requires/
  );
});

test('validateVersionForPreset prerelease accepts base only', () => {
  assert.doesNotThrow(() => validateVersionForPreset('4.11.0', 'plugin-free-unstable'));
  assert.throws(
    () => validateVersionForPreset('4.11.0-rc.2', 'plugin-free-unstable'),
    /base version MAJOR\.MINOR\.PATCH/
  );
});

test('maxPrereleaseNumber scans active and archived releases', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-version-'));
  try {
    const steps = getPreset(PRESET_PLUGIN_FREE_UNSTABLE);
    const a = createReleaseRecord('4.11.0', PRESET_PLUGIN_FREE_UNSTABLE, 'standard', steps, {
      channel: 'beta',
      n: 2,
    });
    saveRelease(a, cwd);
    const archiveDir = join(cwd, 'dev-workspace-cache/releases/archive');
    mkdirSync(archiveDir, { recursive: true });
    const b = createReleaseRecord('4.11.0', PRESET_PLUGIN_FREE_UNSTABLE, 'standard', steps, {
      channel: 'beta',
      n: 4,
    });
    b.status = 'abandoned';
    writeFileSync(join(archiveDir, '4.11.0-old.json'), JSON.stringify(b), 'utf8');
    assert.equal(maxPrereleaseNumber(cwd, '4.11.0', 'beta'), 4);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('start assigns next prerelease n for unstable preset', async () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-version-'));
  try {
    writeFileSync(
      join(cwd, 'composer.json'),
      JSON.stringify({ extra: { 'release-presets': ['plugin-free-unstable'] } }),
      'utf8'
    );
    const steps = getPreset(PRESET_PLUGIN_FREE_UNSTABLE);
    const prior = createReleaseRecord('5.0.0', PRESET_PLUGIN_FREE_UNSTABLE, 'standard', steps, {
      channel: 'rc',
      n: 3,
    });
    prior.status = 'complete';
    saveRelease(prior, cwd);

    process.env.RELEASE_RUNNER_ALLOW_DIRTY = '1';
    await commands.start(['5.0.0', '--prerelease-channel', 'rc'], cwd, { json: true });
    const { loadCurrentRelease } = await import('../scripts/release-runner/state/store.mjs');
    const current = loadCurrentRelease(cwd);
    assert.equal(current.prerelease.channel, 'rc');
    assert.equal(current.prerelease.n, 4);
  } finally {
    delete process.env.RELEASE_RUNNER_ALLOW_DIRTY;
    rmSync(cwd, { recursive: true, force: true });
  }
});
