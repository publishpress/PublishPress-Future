export default {
  id: 'check_quality_cs',
  label: 'Code quality: coding standards',
  phase: 'Code Quality',
  type: 'auto',
  instructions: 'Runs PHPCS to verify PHP matches project coding standards.',
  command: 'composer check:cs',
  run: async (ctx) => {
    await ctx.exec('composer check:cs');
  },
};
