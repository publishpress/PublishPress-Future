import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectEdition } from '../scripts/release-runner/detect-edition.mjs';

/**
 * @param {string} dir
 * @param {object} composer
 */
function writeComposer(dir, composer) {
  writeFileSync(join(dir, 'composer.json'), `${JSON.stringify(composer, null, 2)}\n`, 'utf8');
}

test('detectEdition uses extra.edition when set', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-detect-'));
  try {
    writeComposer(cwd, {
      name: 'publishpress/publishpress-future-pro',
      extra: { edition: 'free' },
    });
    assert.equal(detectEdition(cwd), 'free');
    writeComposer(cwd, {
      name: 'publishpress/publishpress-future',
      extra: { edition: 'pro' },
    });
    assert.equal(detectEdition(cwd), 'pro');
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('detectEdition returns free when composer.json is missing', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-detect-'));
  try {
    assert.equal(detectEdition(cwd), 'free');
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('detectEdition returns free for invalid composer.json', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-detect-'));
  try {
    writeFileSync(join(cwd, 'composer.json'), '{not json', 'utf8');
    assert.equal(detectEdition(cwd), 'free');
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('detectEdition returns free for publishpress-future free package', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-detect-'));
  try {
    writeComposer(cwd, {
      name: 'publishpress/publishpress-future',
      extra: {
        'plugin-slug': 'post-expirator',
        'plugin-github-repo': 'publishpress/publishpress-future',
      },
    });
    assert.equal(detectEdition(cwd), 'free');
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('detectEdition returns pro from package name', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-detect-'));
  try {
    writeComposer(cwd, { name: 'publishpress/publishpress-future-pro' });
    assert.equal(detectEdition(cwd), 'pro');
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('detectEdition returns pro from plugin-slug ending with -pro', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-detect-'));
  try {
    writeComposer(cwd, {
      name: 'publishpress/some-plugin',
      extra: { 'plugin-slug': 'publishpress-authors-pro' },
    });
    assert.equal(detectEdition(cwd), 'pro');
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('detectEdition returns pro from plugin-github-repo containing future-pro', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-detect-'));
  try {
    writeComposer(cwd, {
      name: 'publishpress/some-plugin',
      extra: { 'plugin-github-repo': 'publishpress/publishpress-future-pro' },
    });
    assert.equal(detectEdition(cwd), 'pro');
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test('detectEdition returns pro when lib/composer.json requires publishpress-future', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'rr-detect-'));
  try {
    writeComposer(cwd, { name: 'publishpress/custom-pro-wrapper' });
    const libDir = join(cwd, 'lib');
    mkdirSync(libDir, { recursive: true });
    writeFileSync(
      join(libDir, 'composer.json'),
      JSON.stringify({
        require: { 'publishpress/publishpress-future': '^4.0' },
      }),
      'utf8'
    );
    assert.equal(detectEdition(cwd), 'pro');
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
