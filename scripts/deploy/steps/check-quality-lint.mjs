export default {
  id: 'check_quality_lint',
  label: 'Code quality: lint',
  phase: 'Code Quality',
  type: 'auto',
  command: 'composer check:lint',
  run: async (ctx) => {
    await ctx.exec('composer check:lint');
  },
};
