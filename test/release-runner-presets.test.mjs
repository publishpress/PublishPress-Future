import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getPreset,
  getPresetMeta,
  normalizeEdition,
  parseEditionInput,
  PRESET_PLUGIN_FREE_STABLE,
  PRESET_PLUGIN_FREE_UNSTABLE,
  PRESET_PLUGIN_PRO_STABLE,
  PRESET_PLUGIN_PRO_UNSTABLE,
} from '../scripts/release-runner/presets/index.mjs';

test('getPresetMeta defines labels and version rules per preset', () => {
  assert.equal(getPresetMeta(PRESET_PLUGIN_FREE_STABLE).label, 'Stable');
  assert.equal(getPresetMeta(PRESET_PLUGIN_FREE_STABLE).product, 'free');
  assert.equal(getPresetMeta(PRESET_PLUGIN_PRO_STABLE).label, 'Stable');
  assert.equal(getPresetMeta(PRESET_PLUGIN_FREE_UNSTABLE).label, 'Prerelease');
  assert.equal(getPresetMeta(PRESET_PLUGIN_PRO_STABLE).product, 'pro');
  assert.equal(getPresetMeta(PRESET_PLUGIN_FREE_STABLE).versionRule, 'stable');
  assert.equal(getPresetMeta(PRESET_PLUGIN_FREE_UNSTABLE).versionRule, 'prerelease');
  assert.deepEqual(getPresetMeta(PRESET_PLUGIN_FREE_UNSTABLE).channels, ['beta', 'rc']);
});

test('normalizeEdition maps legacy aliases to stable presets', () => {
  assert.equal(normalizeEdition('free'), PRESET_PLUGIN_FREE_STABLE);
  assert.equal(normalizeEdition('pro'), PRESET_PLUGIN_PRO_STABLE);
});

test('parseEditionInput accepts all plugin preset ids', () => {
  assert.equal(parseEditionInput('plugin-free-unstable'), PRESET_PLUGIN_FREE_UNSTABLE);
  assert.equal(parseEditionInput('plugin-pro-unstable'), PRESET_PLUGIN_PRO_UNSTABLE);
});

test('plugin-free-unstable omits milestone and post-release gates', () => {
  const ids = getPreset(PRESET_PLUGIN_FREE_UNSTABLE).map((s) => s.id);
  assert.ok(!ids.includes('milestone_check'));
  assert.ok(!ids.includes('milestone_close'));
  assert.ok(!ids.includes('post_release'));
  assert.ok(!ids.includes('check_wporg'));
  assert.ok(ids.includes('github_release'));
});

test('plugin-pro-unstable omits milestone steps only', () => {
  const ids = getPreset(PRESET_PLUGIN_PRO_UNSTABLE).map((s) => s.id);
  assert.ok(!ids.includes('milestone_check'));
  assert.ok(!ids.includes('milestone_close'));
  assert.ok(ids.includes('package_server_check'));
});
