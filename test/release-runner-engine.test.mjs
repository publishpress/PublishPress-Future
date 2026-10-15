import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createReleaseRecord, saveRelease } from '../scripts/release-runner/state/store.mjs';
import { fixturePreset } from '../scripts/release-runner/presets/fixture.mjs';
import { runEngine, cascadeReopen } from '../scripts/release-runner/engine/engine.mjs';

test('run stops on manual gate with exit 10', async () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-engine-'));
  try {
    let release = createReleaseRecord('1.0.0', 'fixture', 'standard', fixturePreset);
    release.edition = 'fixture';
    saveRelease(release, cwd);

    const blocked = await runEngine(release, { cwd });
    assert.equal(blocked.exitCode, 10);
    assert.equal(blocked.blocked, 'manual_gate');
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('reopen build_package bumps prerelease n', async () => {
  const { getPreset } = await import('../scripts/release-runner/presets/index.mjs');
  const steps = getPreset('free');
  const release = createReleaseRecord('4.0.0', 'free', 'standard', steps, {
    channel: 'beta',
  });
  release.steps.build_package = { status: 'done', at: new Date().toISOString() };
  cascadeReopen(release, 'build_package', 'free');
  assert.equal(release.prerelease.n, 2);
  assert.equal(release.steps.build_package.status, 'pending');
});

test('run --confirm passes confirm gate', async () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-engine-'));
  try {
    let release = createReleaseRecord('1.0.0', 'fixture', 'standard', fixturePreset);
    release.edition = 'fixture';
    release.steps.auto_ok = { status: 'done', at: new Date().toISOString() };
    release.steps.manual_gate = { status: 'done', at: new Date().toISOString() };
    saveRelease(release, cwd);

    const result = await runEngine(release, { cwd, confirm: 'confirm_gate' });
    assert.equal(result.exitCode, 0);
    assert.equal(result.release.steps.confirm_gate.status, 'done');
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
