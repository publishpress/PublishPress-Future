export default {
  id: 'set_version',
  label: 'Update version numbers in plugin files',
  phase: 'Version & Documentation',
  type: 'auto',
  instructions:
    'Updates plugin version strings in post-expirator.php, readme, and related files for this release.',
  command: (ctx) => `composer set:version ${ctx.data.version}`,
  run: async (ctx) => {
    await ctx.exec(`composer set:version ${ctx.data.version}`);
  },
};
