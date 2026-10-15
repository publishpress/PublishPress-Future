import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  detectEdition,
  inferLegacyStablePreset,
  loadRunnerPresets,
  resolveStartPreset,
} from '../scripts/release-runner/detect-edition.mjs';
import { PRESET_PLUGIN_FREE_STABLE, PRESET_PLUGIN_PRO_STABLE } from '../scripts/release-runner/presets/index.mjs';

function writeComposer(dir, composer) {
  writeFileSync(join(dir, 'composer.json'), `${JSON.stringify(composer, null, 2)}\n`, 'utf8');
}

test('loadRunnerPresets reads extra.release-presets', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-presets-'));
  try {
    writeComposer(cwd, {
      extra: { 'release-presets': ['plugin-free-stable', 'plugin-free-unstable'] },
    });
    assert.deepEqual(loadRunnerPresets(cwd), ['plugin-free-stable', 'plugin-free-unstable']);
    assert.equal(detectEdition(cwd), 'plugin-free-stable');
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('loadRunnerPresets accepts deprecated extra.runner-preset', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-presets-'));
  try {
    writeComposer(cwd, {
      extra: { 'runner-preset': ['plugin-free-stable'] },
    });
    assert.deepEqual(loadRunnerPresets(cwd), ['plugin-free-stable']);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('loadRunnerPresets throws on invalid preset id', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-presets-'));
  try {
    writeComposer(cwd, { extra: { 'release-presets': ['nope'] } });
    assert.throws(() => loadRunnerPresets(cwd), /extra\.release-presets/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('resolveStartPreset requires --preset when multiple configured', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-presets-'));
  try {
    writeComposer(cwd, {
      extra: { 'release-presets': ['plugin-free-stable', 'plugin-pro-stable'] },
    });
    assert.throws(() => resolveStartPreset(cwd, null), /Multiple runner presets/);
    assert.equal(resolveStartPreset(cwd, 'plugin-pro-stable'), 'plugin-pro-stable');
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('resolveStartPreset rejects preset not in composer list', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-presets-'));
  try {
    writeComposer(cwd, { extra: { 'release-presets': ['plugin-free-stable'] } });
    assert.throws(
      () => resolveStartPreset(cwd, 'plugin-pro-stable'),
      /not in composer\.json extra\.release-presets/
    );
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('inferLegacyStablePreset heuristics when release-presets absent', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-presets-'));
  try {
    assert.equal(inferLegacyStablePreset(cwd), PRESET_PLUGIN_FREE_STABLE);
    writeComposer(cwd, { name: 'publishpress/publishpress-future-pro' });
    assert.equal(inferLegacyStablePreset(cwd), PRESET_PLUGIN_PRO_STABLE);
    assert.deepEqual(loadRunnerPresets(cwd), [PRESET_PLUGIN_PRO_STABLE]);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('inferLegacyStablePreset returns pro when lib requires publishpress-future', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-presets-'));
  try {
    writeComposer(cwd, { name: 'publishpress/custom-pro-wrapper' });
    mkdirSync(join(cwd, 'lib'), { recursive: true });
    writeFileSync(
      join(cwd, 'lib/composer.json'),
      JSON.stringify({ require: { 'publishpress/publishpress-future': '^4.0' } }),
      'utf8'
    );
    assert.equal(inferLegacyStablePreset(cwd), PRESET_PLUGIN_PRO_STABLE);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
