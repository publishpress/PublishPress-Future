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
} from '../scripts/release-runner/state/store.mjs';
import { fixturePreset } from '../scripts/release-runner/presets/fixture.mjs';

test('start saves current pointer and release file', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-state-'));
  try {
    const release = createReleaseRecord('1.2.3', 'free', 'standard', fixturePreset);
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
    const release = createReleaseRecord('2.0.0', 'free', 'standard', fixturePreset);
    saveRelease(release, cwd);
    deleteCurrentRelease(cwd);
    assert.equal(loadCurrentRelease(cwd), null);
    assert.equal(loadRelease('2.0.0', cwd), null);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('new archives abandoned release', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-state-'));
  try {
    const first = createReleaseRecord('3.0.0', 'free', 'standard', fixturePreset);
    saveRelease(first, cwd);
    archiveRelease(first, cwd);
    const second = createReleaseRecord('3.1.0', 'pro', 'security', fixturePreset);
    saveRelease(second, cwd);
    const ids = listReleaseIds(cwd);
    assert.ok(ids.archived.includes('3.0.0'));
    assert.equal(loadCurrentRelease(cwd).version, '3.1.0');
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
