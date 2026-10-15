import { fixturePreset } from './fixture.mjs';
import { pluginFreeStablePreset } from './plugin-free-stable.mjs';
import { pluginProStablePreset } from './plugin-pro-stable.mjs';
import { pluginFreeUnstablePreset } from './plugin-free-unstable.mjs';
import { pluginProUnstablePreset } from './plugin-pro-unstable.mjs';
import {
  LEGACY_EDITION_ALIASES,
  PLUGIN_PRESET_IDS,
  PRESET_FIXTURE,
  PRESET_PLUGIN_FREE_STABLE,
  PRESET_PLUGIN_FREE_UNSTABLE,
  PRESET_PLUGIN_PRO_STABLE,
  PRESET_PLUGIN_PRO_UNSTABLE,
} from './ids.mjs';

export {
  LEGACY_EDITION_ALIASES,
  PLUGIN_PRESET_IDS,
  PRESET_FIXTURE,
  PRESET_PLUGIN_FREE_STABLE,
  PRESET_PLUGIN_FREE_UNSTABLE,
  PRESET_PLUGIN_PRO_STABLE,
  PRESET_PLUGIN_PRO_UNSTABLE,
} from './ids.mjs';

/** @typedef {typeof PRESET_PLUGIN_FREE_STABLE | typeof PRESET_PLUGIN_PRO_STABLE | typeof PRESET_PLUGIN_FREE_UNSTABLE | typeof PRESET_PLUGIN_PRO_UNSTABLE | typeof PRESET_FIXTURE | 'free' | 'pro'} ReleaseEditionId */

const VALID_EDITION_VALUES = [...PLUGIN_PRESET_IDS, ...LEGACY_EDITION_ALIASES];

export const EDITION_INPUT_ERROR = `--edition must be one of: ${VALID_EDITION_VALUES.join(', ')}`;

/**
 * @param {unknown} edition
 * @returns {ReleaseEditionId | null}
 */
export function resolveEditionId(edition) {
  if (edition === PRESET_FIXTURE) {
    return PRESET_FIXTURE;
  }
  if (edition === PRESET_PLUGIN_FREE_STABLE || edition === 'free') {
    return PRESET_PLUGIN_FREE_STABLE;
  }
  if (edition === PRESET_PLUGIN_PRO_STABLE || edition === 'pro') {
    return PRESET_PLUGIN_PRO_STABLE;
  }
  if (edition === PRESET_PLUGIN_FREE_UNSTABLE) {
    return PRESET_PLUGIN_FREE_UNSTABLE;
  }
  if (edition === PRESET_PLUGIN_PRO_UNSTABLE) {
    return PRESET_PLUGIN_PRO_UNSTABLE;
  }
  return null;
}

/**
 * Map saved or CLI edition values to a canonical preset id (legacy `free`/`pro` → stable).
 *
 * @param {unknown} edition
 * @returns {ReleaseEditionId}
 */
export function normalizeEdition(edition) {
  const resolved = resolveEditionId(edition);
  if (resolved) {
    return resolved;
  }
  throw new Error(
    `Unknown release edition: ${String(edition)}. Valid: ${VALID_EDITION_VALUES.join(', ')}, ${PRESET_FIXTURE}`
  );
}

/**
 * Normalize CLI `--preset` / `--edition` to a canonical plugin preset id.
 *
 * @param {unknown} edition
 * @returns {typeof PRESET_PLUGIN_FREE_STABLE | typeof PRESET_PLUGIN_PRO_STABLE | typeof PRESET_PLUGIN_FREE_UNSTABLE | typeof PRESET_PLUGIN_PRO_UNSTABLE}
 */
export function parseEditionInput(edition) {
  const resolved = resolveEditionId(edition);
  if (
    resolved === PRESET_PLUGIN_FREE_STABLE
    || resolved === PRESET_PLUGIN_PRO_STABLE
    || resolved === PRESET_PLUGIN_FREE_UNSTABLE
    || resolved === PRESET_PLUGIN_PRO_UNSTABLE
  ) {
    return resolved;
  }
  throw new Error(EDITION_INPUT_ERROR);
}

/**
 * @param {ReleaseEditionId | string} edition
 */
export function getPreset(edition) {
  const id = normalizeEdition(edition);
  if (id === PRESET_FIXTURE) {
    return fixturePreset;
  }
  if (id === PRESET_PLUGIN_PRO_STABLE) {
    return pluginProStablePreset;
  }
  if (id === PRESET_PLUGIN_PRO_UNSTABLE) {
    return pluginProUnstablePreset;
  }
  if (id === PRESET_PLUGIN_FREE_UNSTABLE) {
    return pluginFreeUnstablePreset;
  }
  return pluginFreeStablePreset;
}

export {
  buildPresetMetaPayload,
  getPresetMeta,
  PRESET_META,
  validateVersionForPreset,
} from './meta.mjs';
