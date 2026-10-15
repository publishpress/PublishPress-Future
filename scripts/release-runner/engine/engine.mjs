import { Context } from './context.mjs';
import { runGhAuthLogin } from './pty.mjs';
import { getPreset } from '../presets/index.mjs';
import { resolveEffectiveVersion, saveRelease, touchRelease } from '../state/store.mjs';

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
 * @param {'free'|'pro'} edition
 */
export function getStepPipeline(edition) {
  return getPreset(edition);
}

/**
 * @param {object} release
 * @param {'free'|'pro'} edition
 */
export function orderedStepIds(release, edition) {
  return getPreset(edition).map((s) => s.id);
}

/**
 * @param {object} release
 * @param {string} stepId
 * @param {'free'|'pro'} edition
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
async function runAutoStep(release, stepDef, ctx) {
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
      if (typeof def.run === 'function') {
        await runAutoStep(release, def, ctx);
      }
      release.steps[confirmOnly] = {
        status: 'done',
        at: new Date().toISOString(),
      };
      touchRelease(release);
      saveRelease(release, options.cwd);
    } catch (err) {
      ctx.log(`Error: ${err.message}`);
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
      await runAutoStep(release, stepDef, ctx);
      release.steps[stepDef.id] = {
        status: 'done',
        at: new Date().toISOString(),
      };
      touchRelease(release);
      saveRelease(release, options.cwd);
    } catch (err) {
      ctx.log(`Error: ${err.message}`);
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
      await runAutoStep(release, stepDef, ctx);
      release.steps[stepDef.id] = {
        status: 'done',
        at: new Date().toISOString(),
      };
      touchRelease(release);
      saveRelease(release, options.cwd);
    } catch (err) {
      ctx.log(`Error: ${err.message}`);
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
 * @param {'free'|'pro'} edition
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
 * @param {'free'|'pro'} edition
 */
export function buildStatusPayload(release, edition) {
  const pipeline = getPreset(edition);
  const currentStepId = getCurrentStepId(release, edition);
  return {
    release,
    effectiveVersion: resolveEffectiveVersion(release),
    currentStepId,
    steps: pipeline.map((def) => ({
      id: def.id,
      label: def.label,
      phase: def.phase || '',
      type: def.type,
      status: release.steps[def.id]?.status || 'pending',
      at: release.steps[def.id]?.at,
      note: release.steps[def.id]?.note,
      instructions:
        def.type === 'manual'
          ? resolveField(def.instructions, new Context({ version: resolveEffectiveVersion(release), branchName: release.branchName }))
          : undefined,
      message:
        def.type === 'confirm'
          ? resolveField(def.message, new Context({ version: resolveEffectiveVersion(release), branchName: release.branchName }))
          : undefined,
    })),
  };
}
