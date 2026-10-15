export default {
  id: 'test_integration',
  label: 'Integration tests (run externally)',
  phase: 'Testing',
  type: 'manual',
  command: 'composer test Integration',
  instructions:
    'Run Integration tests outside this deploy container (browser-capable environment), then continue.\n\n' +
    'Suggested command:\n' +
    '  composer test Integration',
};
