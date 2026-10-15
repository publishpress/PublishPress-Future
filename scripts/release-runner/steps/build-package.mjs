export default {
  id: 'build_package',
  label: 'Build plugin package',
  phase: 'Build & Team Testing',
  type: 'auto',
  instructions: 'Builds the distributable plugin ZIP under dist/ via composer build.',
  command: 'composer build',
  run: async (ctx) => {
    await ctx.exec('composer build');
  },
};
