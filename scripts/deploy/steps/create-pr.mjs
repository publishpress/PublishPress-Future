export default {
  id: 'create_pr',
  label: 'Create release pull request',
  phase: 'Release',
  type: 'auto',
  command: (ctx) => `gh pr create --base master --head ${ctx.data.branchName}`,
  run: async (ctx) => {
    await ctx.exec(
      `gh pr create --title "Release ${ctx.data.version}" --body "Release v${ctx.data.version}" --base master --head ${ctx.data.branchName}`
    );
  },
};
