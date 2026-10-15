export default {
  id: 'preflight',
  label: 'Pre-flight check',
  phase: 'Pre-flight & Branch Setup',
  type: 'auto',
  instructions:
    'Requires a clean git working tree before the release starts. Commit, stash, or discard local changes first.',
  command: 'git status --short',
  critical: true,
  run: async (ctx) => {
    if (process.env.RELEASE_RUNNER_ALLOW_DIRTY === '1') {
      ctx.log('Skipping clean working tree check (RELEASE_RUNNER_ALLOW_DIRTY=1).');
    } else {
      const result = await ctx.execCapture('git status --short');
      if (result.stdout.trim()) {
        throw new Error(
          `Git working tree must be clean before a release (commit, stash, or discard changes).\n\n${result.stdout.trim()}`
        );
      }
    }
    const versionResult = await ctx.execCapture('composer get:version 2>/dev/null || echo ""');
    if (versionResult.stdout.trim()) {
      ctx.log(`Current plugin version: ${versionResult.stdout.trim()}`);
    }
  },
};
