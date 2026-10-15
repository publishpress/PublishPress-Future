import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const PRO_PACKAGE_NAME = /future-pro|publishpress-.*-pro/;

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
 * @param {unknown} edition
 * @returns {'free'|'pro'|null}
 */
function parseExtraEdition(edition) {
  if (edition === 'free' || edition === 'pro') {
    return edition;
  }
  if (edition === undefined || edition === null || edition === '') {
    return null;
  }
  throw new Error('composer.json extra.edition must be "free" or "pro"');
}

/**
 * Infer release preset edition from the plugin working copy.
 *
 * @param {string} cwd Plugin repository root
 * @returns {'free'|'pro'}
 */
export function detectEdition(cwd) {
  const composer = readRootComposer(cwd);
  if (!composer) {
    return 'free';
  }

  const extra = composer.extra && typeof composer.extra === 'object' ? composer.extra : {};
  const fromExtra = parseExtraEdition(extra.edition);
  if (fromExtra) {
    return fromExtra;
  }

  const name = typeof composer.name === 'string' ? composer.name : '';
  if (PRO_PACKAGE_NAME.test(name)) {
    return 'pro';
  }

  if (
    extraFieldIndicatesPro(extra['plugin-slug'])
    || extraFieldIndicatesPro(extra['plugin-github-repo'])
  ) {
    return 'pro';
  }

  if (libRequiresPublishPressFuture(cwd)) {
    return 'pro';
  }

  return 'free';
}
