export default {
  id: 'dep_dry_run',
  label: 'Check for dependency updates',
  phase: 'Dependencies',
  type: 'auto',
  command: 'composer update --no-dev --dry-run',
  run: async (ctx) => {
    await ctx.exec('composer update --no-dev --dry-run');
  },
};
