export default {
  id: 'check_quality_longpath',
  label: 'Code quality: longpath',
  phase: 'Code Quality',
  type: 'auto',
  command: 'composer check:longpath',
  run: async (ctx) => {
    await ctx.exec('composer check:longpath');
  },
};
