import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import {
  EDITION_INPUT_ERROR,
  PRESET_PLUGIN_FREE_STABLE,
  PRESET_PLUGIN_PRO_STABLE,
  parseEditionInput,
} from './presets/index.mjs';

const PRO_PACKAGE_NAME = /future-pro|publishpress-.*-pro/;

/** Composer `extra` key: release checklist presets enabled for this plugin clone. */
export const COMPOSER_EXTRA_RELEASE_PRESETS = 'release-presets';

const LEGACY_COMPOSER_EXTRA_RELEASE_PRESETS = 'runner-preset';

/**
 * @param {Record<string, unknown>} extra
 */
function readReleasePresetsFromExtra(extra) {
  const current = extra[COMPOSER_EXTRA_RELEASE_PRESETS];
  if (current !== undefined && current !== null) {
    return current;
  }
  const legacy = extra[LEGACY_COMPOSER_EXTRA_RELEASE_PRESETS];
  if (legacy !== undefined && legacy !== null) {
    process.stderr.write(
      `Warning: composer.json extra.${LEGACY_COMPOSER_EXTRA_RELEASE_PRESETS} is deprecated; use extra.${COMPOSER_EXTRA_RELEASE_PRESETS}.\n`
    );
    return legacy;
  }
  return undefined;
}

/**
 * @param {string | undefined} value
 */
function extraFieldIndicatesPro(value) {
  if (typeof value !== 'string' || value === '') {
    return false;
  }
  return value.includes('future-pro') || value.endsWith('-pro');
}

/**
 * @param {string} cwd
 * @returns {object | null}
 */
function readRootComposer(cwd) {
  const filePath = join(cwd, 'composer.json');
  if (!existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * @param {string} cwd
 */
function libRequiresPublishPressFuture(cwd) {
  const libPath = join(cwd, 'lib/composer.json');
  if (!existsSync(libPath)) {
    return false;
  }
  try {
    const lib = JSON.parse(readFileSync(libPath, 'utf8'));
    const requires = lib.require || {};
    return Object.prototype.hasOwnProperty.call(requires, 'publishpress/publishpress-future');
  } catch {
    return false;
  }
}

/**
 * Infer a single stable preset when `extra.release-presets` is absent (backward compat).
 *
 * @param {string} cwd Plugin repository root
 * @returns {typeof PRESET_PLUGIN_FREE_STABLE | typeof PRESET_PLUGIN_PRO_STABLE}
 */
export function inferLegacyStablePreset(cwd) {
  const composer = readRootComposer(cwd);
  if (!composer) {
    return PRESET_PLUGIN_FREE_STABLE;
  }

  const name = typeof composer.name === 'string' ? composer.name : '';
  if (PRO_PACKAGE_NAME.test(name)) {
    return PRESET_PLUGIN_PRO_STABLE;
  }

  const extra = composer.extra && typeof composer.extra === 'object' ? composer.extra : {};
  if (
    extraFieldIndicatesPro(extra['plugin-slug'])
    || extraFieldIndicatesPro(extra['plugin-github-repo'])
  ) {
    return PRESET_PLUGIN_PRO_STABLE;
  }

  if (libRequiresPublishPressFuture(cwd)) {
    return PRESET_PLUGIN_PRO_STABLE;
  }

  return PRESET_PLUGIN_FREE_STABLE;
}

/**
 * Preset ids listed for this clone (`composer.json` → `extra.release-presets`).
 *
 * @param {string} cwd
 * @returns {Array<ReturnType<typeof parseEditionInput>>}
 */
export function loadRunnerPresets(cwd) {
  const composer = readRootComposer(cwd);
  if (!composer) {
    return [PRESET_PLUGIN_FREE_STABLE];
  }

  const extra = composer.extra && typeof composer.extra === 'object' ? composer.extra : {};
  const raw = readReleasePresetsFromExtra(extra);

  if (raw === undefined || raw === null) {
    return [inferLegacyStablePreset(cwd)];
  }

  if (!Array.isArray(raw)) {
    throw new Error(
      `composer.json extra.${COMPOSER_EXTRA_RELEASE_PRESETS} must be an array of preset id strings`
    );
  }

  if (raw.length === 0) {
    throw new Error(`composer.json extra.${COMPOSER_EXTRA_RELEASE_PRESETS} must list at least one preset id`);
  }

  /** @type {Array<ReturnType<typeof parseEditionInput>>} */
  const ids = [];
  for (const entry of raw) {
    try {
      ids.push(parseEditionInput(entry));
    } catch {
      throw new Error(
        `Invalid preset id in extra.${COMPOSER_EXTRA_RELEASE_PRESETS}: ${String(entry)}. ${EDITION_INPUT_ERROR}`
      );
    }
  }
  return ids;
}

/**
 * Resolve preset for `start` from CLI flags and composer list.
 *
 * @param {string} cwd
 * @param {string | null | undefined} explicitPreset From --preset / --edition
 * @returns {ReturnType<typeof parseEditionInput>}
 */
export function resolveStartPreset(cwd, explicitPreset) {
  const available = loadRunnerPresets(cwd);

  if (explicitPreset !== undefined && explicitPreset !== null && explicitPreset !== '') {
    const id = parseEditionInput(explicitPreset);
    if (!available.includes(id)) {
      throw new Error(
        `Preset "${id}" is not in composer.json extra.${COMPOSER_EXTRA_RELEASE_PRESETS} (available: ${available.join(', ')})`
      );
    }
    return id;
  }

  if (available.length === 1) {
    return available[0];
  }

  throw new Error(
    `Multiple runner presets configured. Pass --preset <id>. Available: ${available.join(', ')}`
  );
}

/**
 * Default preset for UI (first entry in `extra.release-presets`).
 *
 * @param {string} cwd
 * @returns {ReturnType<typeof parseEditionInput>}
 */
export function detectEdition(cwd) {
  return loadRunnerPresets(cwd)[0];
}
