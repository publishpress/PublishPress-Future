export default {
  id: 'check_wporg',
  label: 'Run composer check:wporg',
  phase: 'Post-Release',
  type: 'auto',
  run: async (ctx) => {
    await ctx.exec('composer check:wporg');
  },
};
