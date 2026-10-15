export default {
  id: 'milestone_close',
  label: 'Close GitHub milestone',
  phase: 'Post-Release',
  type: 'manual',
  instructions: (ctx) =>
    `Close the GitHub milestone for v${ctx.data.version} on GitHub.`,
};
