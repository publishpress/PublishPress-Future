export default {
  id: 'check_wporg',
  label: 'Run composer check:wporg',
  phase: 'Post-Release',
  type: 'auto',
  instructions:
    'Runs WordPress.org plugin directory checks (readme, assets, and packaging rules) after publish.',
  command: 'composer check:wporg',
  run: async (ctx) => {
    await ctx.exec('composer check:wporg');
  },
};
