import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';

const THEMES = ['light', 'dark'];

/**
 * @param {string} [cwd]
 */
export function getUiPrefsPath(cwd = process.cwd()) {
  return resolve(cwd, 'dev-workspace-cache/release-runner-ui.json');
}

/**
 * Page preferences saved by the UI (currently the theme). Unknown or invalid values are dropped.
 *
 * @param {string} [cwd]
 * @returns {{ theme?: 'light' | 'dark' }}
 */
export function loadUiPrefs(cwd = process.cwd()) {
  const path = getUiPrefsPath(cwd);
  if (!existsSync(path)) {
    return {};
  }
  try {
    const data = JSON.parse(readFileSync(path, 'utf8'));
    return THEMES.includes(data?.theme) ? { theme: data.theme } : {};
  } catch {
    return {};
  }
}

/**
 * @param {{ theme?: string }} patch
 * @param {string} [cwd]
 * @returns {{ theme?: 'light' | 'dark' }}
 */
export function saveUiPrefs(patch, cwd = process.cwd()) {
  if (!THEMES.includes(patch?.theme)) {
    throw new Error(`Invalid theme: ${patch?.theme}. Use light or dark.`);
  }
  const prefs = { ...loadUiPrefs(cwd), theme: patch.theme };
  const path = getUiPrefsPath(cwd);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(prefs, null, 2)}\n`);
  return prefs;
}
