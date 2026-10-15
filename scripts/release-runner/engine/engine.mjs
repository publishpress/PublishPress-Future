import { Context } from './context.mjs';
import { runGhAuthLogin } from './pty.mjs';
import { getPreset } from '../presets/index.mjs';
import {
  resolveEffectiveVersion,
  saveRelease,
  syncReleaseSteps,
  touchRelease,
} from '../state/store.mjs';
import { isRunStopped, throwIfRunStopRequested } from '../run-control.mjs';

/** Step id executing right now in this process, for the page's `running` status. */
let activeStepId = null;

export function getActiveStepId() {
  return activeStepId;
}

/**
 * @param {string | ((ctx: Context) => string)} field
 * @param {Context} ctx
 */
export function resolveField(field, ctx) {
  if (typeof field === 'function') {
    return field(ctx);
  }
  return field || '';
}

/**
 * @param {import('../presets/index.mjs').ReleaseEditionId | string} edition
 */
export function getStepPipeline(edition) {
  return getPreset(edition);
}

/**
 * @param {object} release
 * @param {import('../presets/index.mjs').ReleaseEditionId | string} edition
 */
export function orderedStepIds(release, edition) {
  return getPreset(edition).map((s) => s.id);
}

/**
 * @param {object} release
 * @param {string} stepId
 * @param {import('../presets/index.mjs').ReleaseEditionId | string} edition
 */
export function cascadeReopen(release, stepId, edition) {
  const ids = orderedStepIds(release, edition);
  const idx = ids.indexOf(stepId);
  if (idx === -1) {
    throw new Error(`Unknown step: ${stepId}`);
  }
  for (let i = idx; i < ids.length; i += 1) {
    const id = ids[i];
    if (release.steps[id]) {
      release.steps[id] = { status: 'pending' };
    }
  }
  if (stepId === 'build_package' && release.prerelease?.channel) {
    release.prerelease.n += 1;
  }
  touchRelease(release);
  return release;
}

/**
 * @param {object} release
 * @param {import('../presets/types.mjs').StepDefinition} stepDef
 * @param {Context} ctx
 */
/**
 * @param {unknown} result
 * @returns {string | undefined}
 */
function noteFromStepRun(result) {
  if (!result) {
    return undefined;
  }
  if (typeof result === 'string' && result.trim()) {
    return result.trim();
  }
  if (typeof result === 'object' && result !== null && 'note' in result) {
    const note = result.note;
    return typeof note === 'string' && note.trim() ? note.trim() : undefined;
  }
  return undefined;
}

/**
 * @returns {Promise<string | undefined>}
 */
async function runAutoStep(release, stepDef, ctx) {
  activeStepId = stepDef.id;
  ctx.log(`▶ ${stepDef.id}`);
  try {
    return noteFromStepRun(await runAutoStepInner(stepDef, ctx));
  } finally {
    activeStepId = null;
  }
}

/**
 * @param {import('../presets/types.mjs').StepDefinition} stepDef
 * @param {Context} ctx
 */
/**
 * @param {Context} ctx
 * @param {Error} err
 */
function logStepFailure(ctx, err) {
  const headline = String(err.message).split('\n\n')[0].split('\n')[0];
  ctx.log(`Error: ${headline}`);
}

/**
 * @param {object} release
 * @param {import('../presets/types.mjs').StepDefinition} stepDef
 * @param {Context} ctx
 * @param {object} options
 */
function handleStoppedStep(release, stepDef, ctx, options) {
  ctx.log('Stopped by user.');
  release.steps[stepDef.id] = { status: 'pending' };
  touchRelease(release);
  saveRelease(release, options.cwd);
  return { exitCode: 130, release, error: 'Stopped by user' };
}

async function runAutoStepInner(stepDef, ctx) {
  if (stepDef.id === 'github_auth' && typeof stepDef.setup === 'function') {
    const status = await ctx.execCapture('gh auth status 2>&1');
    if (status.code !== 0) {
      ctx.log('GitHub CLI not authenticated — starting web login…');
      await runGhAuthLogin({ cwd: ctx.cwd });
    }
  }

  if (typeof stepDef.setup === 'function') {
    await stepDef.setup(ctx);
  }

  if (typeof stepDef.run !== 'function') {
    return;
  }

  await stepDef.run(ctx);
}

/**
 * @param {object} release
 * @param {{ cwd?: string, until?: string, confirm?: string, onLog?: (line: string) => void }} options
 * @returns {Promise<{ exitCode: number, blocked?: string, release: object, error?: string }>}
 */
export async function runEngine(release, options = {}) {
  const { changed } = syncReleaseSteps(release);
  if (changed && options.cwd) {
    saveRelease(release, options.cwd);
  }
  const edition = release.edition;
  const pipeline = getPreset(edition);
  const ctx = new Context(
    {
      version: resolveEffectiveVersion(release),
      branchName: release.branchName,
      edition: release.edition,
      urgency: release.urgency,
      prerelease: release.prerelease,
    },
    { cwd: options.cwd, onLog: options.onLog }
  );
  ctx.setupDeployLog();

  try {
    return await runEngineInner(release, pipeline, ctx, options);
  } finally {
    await ctx.closeLog();
  }
}

/**
 * @param {object} release
 * @param {import('../presets/types.mjs').StepDefinition[]} pipeline
 * @param {Context} ctx
 * @param {object} options
 */
async function runEngineInner(release, pipeline, ctx, options) {
  const confirmOnly = options.confirm;
  if (confirmOnly) {
    const def = pipeline.find((s) => s.id === confirmOnly);
    if (!def || def.type !== 'confirm') {
      return {
        exitCode: 1,
        release,
        error: `Step "${confirmOnly}" is not a confirm gate`,
      };
    }
    const state = release.steps[confirmOnly];
    if (!state || state.status === 'done' || state.status === 'skipped') {
      return { exitCode: 0, release };
    }
    try {
      let runNote;
      if (typeof def.run === 'function') {
        runNote = await runAutoStep(release, def, ctx);
      }
      release.steps[confirmOnly] = {
        status: 'done',
        at: new Date().toISOString(),
        ...(runNote ? { note: runNote } : {}),
      };
      touchRelease(release);
      saveRelease(release, options.cwd);
    } catch (err) {
      if (isRunStopped(err)) {
        return handleStoppedStep(release, def, ctx, options);
      }
      logStepFailure(ctx, err);
      release.steps[confirmOnly] = {
        status: 'failed',
        at: new Date().toISOString(),
        note: err.message,
      };
      touchRelease(release);
      saveRelease(release, options.cwd);
      return { exitCode: 1, release, error: err.message };
    }
    return continueAfterStep(release, confirmOnly, pipeline, ctx, options);
  }

  for (const stepDef of pipeline) {
    throwIfRunStopRequested();
    const stepState = release.steps[stepDef.id];
    if (!stepState) {
      continue;
    }
    if (stepState.status === 'done' || stepState.status === 'skipped') {
      continue;
    }

    if (stepDef.skip && stepDef.skip(ctx)) {
      release.steps[stepDef.id] = {
        status: 'skipped',
        at: new Date().toISOString(),
      };
      touchRelease(release);
      saveRelease(release, options.cwd);
      if (options.until === stepDef.id) {
        return { exitCode: 0, release };
      }
      continue;
    }

    if (stepDef.type === 'manual' || stepDef.type === 'confirm') {
      return {
        exitCode: 10,
        blocked: stepDef.id,
        release,
      };
    }

    try {
      const runNote = await runAutoStep(release, stepDef, ctx);
      release.steps[stepDef.id] = {
        status: 'done',
        at: new Date().toISOString(),
        ...(runNote ? { note: runNote } : {}),
      };
      touchRelease(release);
      saveRelease(release, options.cwd);
    } catch (err) {
      if (isRunStopped(err)) {
        return handleStoppedStep(release, stepDef, ctx, options);
      }
      logStepFailure(ctx, err);
      release.steps[stepDef.id] = {
        status: 'failed',
        at: new Date().toISOString(),
        note: err.message,
      };
      touchRelease(release);
      saveRelease(release, options.cwd);
      return { exitCode: 1, release, error: err.message };
    }

    if (options.until === stepDef.id) {
      return { exitCode: 0, release };
    }
  }

  const allDone = pipeline.every((s) => {
    const st = release.steps[s.id]?.status;
    return st === 'done' || st === 'skipped';
  });
  if (allDone) {
    release.status = 'complete';
    touchRelease(release);
    saveRelease(release, options.cwd);
  }

  return { exitCode: 0, release };
}

/**
 * @param {object} release
 * @param {string} afterStepId
 * @param {import('../presets/types.mjs').StepDefinition[]} pipeline
 * @param {Context} ctx
 * @param {object} options
 */
async function continueAfterStep(release, afterStepId, pipeline, ctx, options) {
  let passed = false;
  for (const stepDef of pipeline) {
    throwIfRunStopRequested();
    if (!passed) {
      if (stepDef.id === afterStepId) {
        passed = true;
      }
      continue;
    }
    const stepState = release.steps[stepDef.id];
    if (!stepState) {
      continue;
    }
    if (stepState.status === 'done' || stepState.status === 'skipped') {
      continue;
    }

    if (stepDef.skip && stepDef.skip(ctx)) {
      release.steps[stepDef.id] = {
        status: 'skipped',
        at: new Date().toISOString(),
      };
      touchRelease(release);
      saveRelease(release, options.cwd);
      if (options.until === stepDef.id) {
        return { exitCode: 0, release };
      }
      continue;
    }

    if (stepDef.type === 'manual' || stepDef.type === 'confirm') {
      return {
        exitCode: 10,
        blocked: stepDef.id,
        release,
      };
    }

    try {
      const runNote = await runAutoStep(release, stepDef, ctx);
      release.steps[stepDef.id] = {
        status: 'done',
        at: new Date().toISOString(),
        ...(runNote ? { note: runNote } : {}),
      };
      touchRelease(release);
      saveRelease(release, options.cwd);
    } catch (err) {
      if (isRunStopped(err)) {
        return handleStoppedStep(release, stepDef, ctx, options);
      }
      logStepFailure(ctx, err);
      release.steps[stepDef.id] = {
        status: 'failed',
        at: new Date().toISOString(),
        note: err.message,
      };
      touchRelease(release);
      saveRelease(release, options.cwd);
      return { exitCode: 1, release, error: err.message };
    }

    if (options.until === stepDef.id) {
      return { exitCode: 0, release };
    }
  }

  return { exitCode: 0, release };
}

/**
 * @param {object} release
 * @param {import('../presets/index.mjs').ReleaseEditionId | string} edition
 */
export function getCurrentStepId(release, edition) {
  const pipeline = getPreset(edition);
  for (const stepDef of pipeline) {
    const st = release.steps[stepDef.id]?.status;
    if (st !== 'done' && st !== 'skipped') {
      return stepDef.id;
    }
  }
  return null;
}

/**
 * @param {object} release
 * @param {import('../presets/index.mjs').ReleaseEditionId | string} edition
 */
export function buildStatusPayload(release, edition) {
  const pipeline = getPreset(edition);
  const currentStepId = getCurrentStepId(release, edition);
  const ctx = new Context({
    version: resolveEffectiveVersion(release),
    branchName: release.branchName,
    edition: release.edition,
    urgency: release.urgency,
    prerelease: release.prerelease,
  });
  return {
    release,
    effectiveVersion: resolveEffectiveVersion(release),
    currentStepId,
    steps: pipeline.map((def) => ({
      id: def.id,
      label: def.label,
      phase: def.phase || '',
      type: def.type,
      publish: def.publish === true,
      status: displayStatus(release, def, currentStepId),
      at: release.steps[def.id]?.at,
      note: release.steps[def.id]?.note,
      command: resolveField(def.command, ctx) || undefined,
      instructions: (() => {
        const fromDef = resolveField(def.instructions, ctx);
        if (fromDef) {
          return fromDef;
        }
        if (def.type === 'confirm' || def.type === 'manual') {
          return resolveField(def.message, ctx) || undefined;
        }
        return undefined;
      })(),
      message: def.type === 'confirm' ? resolveField(def.message, ctx) : undefined,
    })),
  };
}

/**
 * Persisted status plus two live states for the page: `running` while this process
 * executes the step, and `waiting` for the manual/confirm gate a bare `run` stops on (exit 10).
 *
 * @param {object} release
 * @param {import('../presets/types.mjs').StepDefinition} def
 * @param {string|null} currentStepId
 */
export function displayStatus(release, def, currentStepId) {
  const status = release.steps[def.id]?.status || 'pending';
  if (def.id === activeStepId) {
    return 'running';
  }
  if (status === 'pending' && def.id === currentStepId && (def.type === 'manual' || def.type === 'confirm')) {
    return 'waiting';
  }
  return status;
}
