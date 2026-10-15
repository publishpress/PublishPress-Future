export default {
  id: 'github_auth',
  label: 'Verify GitHub CLI authentication',
  phase: 'Pre-flight & Branch Setup',
  type: 'auto',
  instructions: 'Confirms GitHub CLI is authenticated as the account that can push branches, open PRs, and create releases.',
  command: 'gh auth status',
  critical: true,
  run: async (ctx) => {
    const result = await ctx.execCapture('gh auth status 2>&1');
    if (result.code !== 0) {
      const err = new Error(
        'GitHub CLI is not authenticated. Run the release runner again after completing `gh auth login`.'
      );
      err.stdout = result.stdout;
      err.stderr = result.stderr;
      throw err;
    }
    const match = result.stdout.match(/Logged in to \S+ account (\S+)/);
    if (match) {
      ctx.log(`GitHub authenticated as: ${match[1]}`);
    }
    await ctx.execCapture('gh auth setup-git');
  },
};
