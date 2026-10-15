export default {
  id: 'check_quality_longpath',
  label: 'Code quality: longpath',
  phase: 'Code Quality',
  type: 'auto',
  instructions: 'Ensures no paths in the release tree exceed Windows MAX_PATH limits.',
  command: 'composer check:longpath',
  run: async (ctx) => {
    await ctx.exec('composer check:longpath');
  },
};
