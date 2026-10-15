export default {
  id: 'merge_to_master',
  label: 'Merge release branch to master',
  phase: 'Release',
  type: 'confirm',
  publish: true,
  message: (ctx) => `Merge the release PR (${ctx.data.branchName} → master) on GitHub, then continue.`,
};
