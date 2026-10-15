export default {
  id: 'package_server_check',
  label: 'Verify package server deployment',
  phase: 'Post-Release',
  type: 'manual',
  instructions: (ctx) =>
    [
      `Monitor GitHub Actions and Slack #package-server for v${ctx.data.version}.`,
      'Confirm package server deployment completed successfully.',
    ].join('\n'),
};
