import { fixturePreset } from './fixture.mjs';
import { freePreset } from './free.mjs';
import { proPreset } from './pro.mjs';

/**
 * @param {'free'|'pro'|'fixture'} edition
 */
export function getPreset(edition) {
  if (edition === 'fixture') {
    return fixturePreset;
  }
  if (edition === 'pro') {
    return proPreset;
  }
  return freePreset;
}
