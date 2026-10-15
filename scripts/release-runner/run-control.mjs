/** @type {Set<import('child_process').ChildProcess>} */
const activeChildren = new Set();

let stopRequested = false;

export class RunStoppedError extends Error {
  constructor(message = 'Stopped by user') {
    super(message);
    this.name = 'RunStoppedError';
  }
}

/**
 * @param {unknown} err
 */
export function isRunStopped(err) {
  return err instanceof RunStoppedError || (err && typeof err === 'object' && err.name === 'RunStoppedError');
}

export function beginRunSession() {
  stopRequested = false;
}

export function endRunSession() {
  stopRequested = false;
}

export function isRunStopRequested() {
  return stopRequested;
}

/**
 * @param {import('child_process').ChildProcess} child
 */
export function registerRunChild(child) {
  activeChildren.add(child);
  child.on('close', () => {
    activeChildren.delete(child);
  });
}

export function requestStopRun() {
  stopRequested = true;
  for (const child of activeChildren) {
    try {
      child.kill('SIGTERM');
    } catch {
      /* ignore */
    }
  }
}

export function throwIfRunStopRequested() {
  if (stopRequested) {
    throw new RunStoppedError();
  }
}

/** @type {(() => void) | null} */
let shutdownHandler = null;

/**
 * @param {() => void} fn
 */
export function setShutdownHandler(fn) {
  shutdownHandler = fn;
}

export function requestShutdown() {
  requestStopRun();
  if (shutdownHandler) {
    shutdownHandler();
    return;
  }
  process.exit(0);
}
