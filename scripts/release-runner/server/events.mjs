/** @type {Set<(data: string) => void>} */
const listeners = new Set();

/**
 * @param {(data: string) => void} fn
 */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * @param {string} data
 */
export function publishLog(data) {
  for (const fn of listeners) {
    fn(data);
  }
}
