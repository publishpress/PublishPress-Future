export default {
  id: 'check_quality_php',
  label: 'Code quality: PHP compatibility',
  phase: 'Code Quality',
  type: 'auto',
  command: 'composer check:php',
  run: async (ctx) => {
    await ctx.exec('composer check:php');
  },
};
