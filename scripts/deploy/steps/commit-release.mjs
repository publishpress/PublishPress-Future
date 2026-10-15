export default {
  id: 'commit_release',
  label: 'Commit all release changes',
  phase: 'Version & Documentation',
  type: 'auto',
  instructions: 'Stages all pending release changes and creates the release commit on the branch.',
  command: (ctx) => `git add -A && git commit -m "Release v${ctx.data.version}" --allow-empty`,
  run: async (ctx) => {
    await ctx.exec('git add -A');
    await ctx.exec(`git commit -m "Release v${ctx.data.version}" --allow-empty`);
  },
};
