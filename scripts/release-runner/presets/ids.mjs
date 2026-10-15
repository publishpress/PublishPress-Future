export const PRESET_PLUGIN_FREE_STABLE = 'plugin-free-stable';
export const PRESET_PLUGIN_PRO_STABLE = 'plugin-pro-stable';
export const PRESET_PLUGIN_FREE_UNSTABLE = 'plugin-free-unstable';
export const PRESET_PLUGIN_PRO_UNSTABLE = 'plugin-pro-unstable';
export const PRESET_FIXTURE = 'fixture';

/** @type {readonly string[]} */
export const PLUGIN_PRESET_IDS = [
  PRESET_PLUGIN_FREE_STABLE,
  PRESET_PLUGIN_PRO_STABLE,
  PRESET_PLUGIN_FREE_UNSTABLE,
  PRESET_PLUGIN_PRO_UNSTABLE,
];

/** Legacy aliases mapped to stable presets in {@link normalizeEdition}. */
export const LEGACY_EDITION_ALIASES = ['free', 'pro'];
