export default {
  id: 'branch_setup',
  label: 'Create/checkout release branch',
  phase: 'Pre-flight & Branch Setup',
  type: 'auto',
  instructions:
    'Creates or checks out the release branch locally and pushes it to origin for PRs and CI.',
  command: (ctx) => `git checkout -b ${ctx.data.branchName} && git push -u origin ${ctx.data.branchName}`,
  run: async (ctx) => {
    const branch = ctx.data.branchName;

    // Fetch is best-effort — 15s timeout in case credentials/network hang inside container.
    const fetch = await ctx.execCapture('git fetch origin', { timeout: 15000 });
    if (fetch.code !== 0) {
      ctx.log(`Warning: git fetch failed (${fetch.stderr.trim() || 'no output'}). Continuing with local state.`);
    }

    const ref = await ctx.execCapture(`git show-ref --verify --quiet refs/heads/${branch}`, { quiet: true });
    const createdLocally = ref.code !== 0;
    if (createdLocally) {
      await ctx.exec(`git checkout -b ${branch}`);
      ctx.log(`Created local branch ${branch} and checked out.`);
    } else {
      await ctx.exec(`git checkout ${branch}`);
      ctx.log(`Local branch ${branch} already exists; checked out.`);
    }

    const push = await ctx.execCapture(`git push -u origin ${branch}`, { timeout: 15000 });
    if (push.code !== 0) {
      ctx.log(`Warning: git push failed. Push manually if needed:\n  git push -u origin ${branch}`);
      return `Local branch ${createdLocally ? 'created' : 'already existed'}; push to origin failed (see Output while running).`;
    }

    ctx.log(`Pushed ${branch} to origin (upstream set).`);
    return `Local branch ${createdLocally ? 'created' : 'already existed'}; pushed to origin.`;
  },
};
