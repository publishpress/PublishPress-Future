import {
  PRESET_PLUGIN_FREE_STABLE,
  PRESET_PLUGIN_FREE_UNSTABLE,
  PRESET_PLUGIN_PRO_STABLE,
  PRESET_PLUGIN_PRO_UNSTABLE,
} from './ids.mjs';
import { normalizeEdition } from './index.mjs';

/** @typedef {'stable' | 'prerelease'} VersionRule */

/**
 * @typedef {object} PresetMeta
 * @property {string} label Human-friendly preset name for UI and CLI hints
 * @property {'free' | 'pro'} product Plugin line (shown as a badge; not part of the title)
 * @property {VersionRule} versionRule
 * @property {readonly ('beta'|'rc')[] | undefined} channels
 */

/** @type {Record<string, PresetMeta>} */
export const PRESET_META = {
  [PRESET_PLUGIN_FREE_STABLE]: {
    label: 'Stable',
    product: 'free',
    versionRule: 'stable',
  },
  [PRESET_PLUGIN_PRO_STABLE]: {
    label: 'Stable',
    product: 'pro',
    versionRule: 'stable',
  },
  [PRESET_PLUGIN_FREE_UNSTABLE]: {
    label: 'Prerelease',
    product: 'free',
    versionRule: 'prerelease',
    channels: ['beta', 'rc'],
  },
  [PRESET_PLUGIN_PRO_UNSTABLE]: {
    label: 'Prerelease',
    product: 'pro',
    versionRule: 'prerelease',
    channels: ['beta', 'rc'],
  },
};

const BASE_VERSION = /^\d+\.\d+\.\d+$/;

/**
 * @param {string} presetId
 * @returns {PresetMeta}
 */
export function getPresetMeta(presetId) {
  const id = normalizeEdition(presetId);
  const meta = PRESET_META[id];
  if (!meta) {
    throw new Error(`No preset metadata for ${id}`);
  }
  return meta;
}

/**
 * @param {string} version
 * @param {string} presetId
 */
export function validateVersionForPreset(version, presetId) {
  const meta = getPresetMeta(presetId);
  if (meta.versionRule === 'stable') {
    if (!BASE_VERSION.test(version)) {
      throw new Error(
        'Stable preset requires MAJOR.MINOR.PATCH only (e.g. 4.11.0). No -beta.n or -rc.n in the start version.'
      );
    }
    return;
  }
  if (!BASE_VERSION.test(version)) {
    throw new Error(
      'Prerelease preset requires base version MAJOR.MINOR.PATCH only (e.g. 4.11.0). Package suffix comes from beta/rc state.'
    );
  }
}

/**
 * @param {readonly string[]} presetIds
 * @returns {Record<string, PresetMeta>}
 */
export function buildPresetMetaPayload(presetIds) {
  /** @type {Record<string, PresetMeta>} */
  const out = {};
  for (const id of presetIds) {
    out[id] = getPresetMeta(id);
  }
  return out;
}
