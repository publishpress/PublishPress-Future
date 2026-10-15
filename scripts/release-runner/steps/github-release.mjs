export default {
  id: 'github_release',
  label: 'Create GitHub release',
  phase: 'Release',
  type: 'confirm',
  publish: true,
  instructions: (ctx) =>
    `Create the GitHub release on master with tag ${ctx.data.version} (no "v" prefix). Do not move the tag after deploy workflows start.`,
  command: (ctx) => `gh release create ${ctx.data.version} --target master --generate-notes`,
  message: (ctx) =>
    [
      `Create the GitHub release on master with tag name ${ctx.data.version} (no "v" prefix).`,
      'Tag the merged master commit. Do not move the tag after deploy workflows start.',
      'Use Confirm in the UI or: composer deploy -- run --confirm github_release',
    ].join('\n'),
  run: async (ctx) => {
    await ctx.exec(
      `gh release create ${ctx.data.version} --target master --generate-notes`
    );
  },
};
