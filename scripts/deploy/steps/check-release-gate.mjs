export default {
  id: 'check_release',
  label: 'Run composer check:release',
  phase: 'Build & Test',
  type: 'auto',
  command: 'composer check:release',
  run: async (ctx) => {
    await ctx.exec('composer check:release');
  },
};
