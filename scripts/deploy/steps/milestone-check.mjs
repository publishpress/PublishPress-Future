export default {
  id: 'milestone_check',
  label: 'Verify GitHub milestone',
  phase: 'Pre-Release Preparation',
  type: 'manual',
  instructions: (ctx) =>
    `Verify the GitHub milestone for v${ctx.data.version} exists and all issues/PRs are closed or deferred before continuing.`,
};
