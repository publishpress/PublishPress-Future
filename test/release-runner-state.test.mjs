import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createReleaseRecord,
  deleteCurrentRelease,
  loadCurrentRelease,
  loadRelease,
  saveRelease,
  archiveRelease,
  listReleaseIds,
  syncReleaseSteps,
} from '../scripts/release-runner/state/store.mjs';
import { fixturePreset } from '../scripts/release-runner/presets/fixture.mjs';
import { PRESET_PLUGIN_FREE_STABLE, PRESET_PLUGIN_PRO_STABLE } from '../scripts/release-runner/presets/index.mjs';
import { commands } from '../scripts/release-runner/cli.mjs';

test('start saves current pointer and release file', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-state-'));
  try {
    const release = createReleaseRecord('1.2.3', 'plugin-free-stable', 'standard', fixturePreset);
    saveRelease(release, cwd);
    const loaded = loadCurrentRelease(cwd);
    assert.equal(loaded.version, '1.2.3');
    assert.equal(loaded.status, 'in_progress');
    assert.equal(loaded.steps.auto_ok.status, 'pending');
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('reset deletes current release and pointer', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-state-'));
  try {
    const release = createReleaseRecord('2.0.0', 'plugin-free-stable', 'standard', fixturePreset);
    saveRelease(release, cwd);
    deleteCurrentRelease(cwd);
    assert.equal(loadCurrentRelease(cwd), null);
    assert.equal(loadRelease('2.0.0', cwd), null);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('syncReleaseSteps adds missing preset steps and complete works', async () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-state-'));
  try {
    const release = createReleaseRecord('1.0.0', 'fixture', 'standard', fixturePreset);
    release.edition = 'fixture';
    release.steps.auto_ok = { status: 'done', at: new Date().toISOString() };
    delete release.steps.manual_gate;
    saveRelease(release, cwd);

    const loaded = loadCurrentRelease(cwd);
    assert.ok(loaded.steps.manual_gate);
    assert.equal(loaded.steps.manual_gate.status, 'pending');

    const exitCode = await commands.complete(['manual_gate'], cwd, { json: true });
    assert.equal(exitCode, 0);
    const after = loadCurrentRelease(cwd);
    assert.equal(after.steps.manual_gate.status, 'done');
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('syncReleaseSteps is idempotent', () => {
  const release = createReleaseRecord('9.9.9', 'fixture', 'standard', fixturePreset);
  release.edition = 'fixture';
  const first = syncReleaseSteps(release);
  assert.equal(first.changed, false);
  delete release.steps.manual_gate;
  const second = syncReleaseSteps(release);
  assert.equal(second.changed, true);
  assert.equal(release.steps.manual_gate.status, 'pending');
});

test('new archives abandoned release', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-state-'));
  try {
    const first = createReleaseRecord('3.0.0', 'plugin-free-stable', 'standard', fixturePreset);
    saveRelease(first, cwd);
    archiveRelease(first, cwd);
    const second = createReleaseRecord('3.1.0', 'plugin-pro-stable', 'security', fixturePreset);
    saveRelease(second, cwd);
    const ids = listReleaseIds(cwd);
    assert.ok(ids.archived.includes('3.0.0'));
    assert.equal(loadCurrentRelease(cwd).version, '3.1.0');
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});


test('syncReleaseSteps migrates legacy edition ids', () => {
  const release = createReleaseRecord('1.0.0', 'free', 'standard', fixturePreset);
  release.edition = 'free';
  const { release: synced, changed } = syncReleaseSteps(release);
  assert.equal(changed, true);
  assert.equal(synced.edition, PRESET_PLUGIN_FREE_STABLE);
});
