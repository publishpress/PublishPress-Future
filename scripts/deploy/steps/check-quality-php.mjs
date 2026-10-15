export default {
  id: 'check_quality_php',
  label: 'Code quality: PHP compatibility',
  phase: 'Code Quality',
  type: 'auto',
  instructions: 'Checks PHP syntax and compatibility with the minimum supported PHP version.',
  command: 'composer check:php',
  run: async (ctx) => {
    await ctx.exec('composer check:php');
  },
};
