export default {
  id: 'build_package',
  label: 'Build plugin package',
  phase: 'Build & Team Testing',
  type: 'auto',
  command: 'composer build',
  run: async (ctx) => {
    await ctx.exec('composer build');
  },
};
