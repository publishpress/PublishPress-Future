export default {
  id: 'milestone_check',
  label: 'Verify GitHub milestone',
  phase: 'Pre-Release Preparation',
  type: 'manual',
  instructions: (ctx) =>
    `Open the GitHub milestone for v${ctx.data.version}. Confirm every issue and PR is closed or explicitly deferred—not still open for this release.`,
};
