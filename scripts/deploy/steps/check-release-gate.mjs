export default {
  id: 'check_release',
  label: 'Run composer check:release',
  phase: 'Build & Test',
  type: 'auto',
  instructions:
    'Runs composer check:release — version, changelog, and packaging checks before the distributable build.',
  command: 'composer check:release',
  run: async (ctx) => {
    await ctx.exec('composer check:release');
  },
};
