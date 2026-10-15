export default {
  id: 'merge_to_master',
  label: 'Merge release branch to master',
  phase: 'Release',
  type: 'confirm',
  publish: true,
  instructions: (ctx) =>
    `Merge the release PR (${ctx.data.branchName} → master) on GitHub so master contains the release commit.`,
  message: (ctx) => `Merge the release PR (${ctx.data.branchName} → master) on GitHub, then continue.`,
};
