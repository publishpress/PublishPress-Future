export default {
  id: 'dep_dry_run',
  label: 'Check for dependency updates',
  phase: 'Dependencies',
  type: 'auto',
  instructions:
    'Previews composer dependency updates without changing lock files. Use the log to decide whether updates are needed.',
  command: 'composer update --no-dev --dry-run',
  run: async (ctx) => {
    await ctx.exec('composer update --no-dev --dry-run');
  },
};
