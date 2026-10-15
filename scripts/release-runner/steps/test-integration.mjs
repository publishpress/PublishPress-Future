export default {
  id: 'test_integration',
  label: 'Integration tests (run externally)',
  phase: 'Testing',
  type: 'manual',
  command: 'composer test Integration',
  instructions:
    'Exercises WordPress integration paths before merge; run outside the deploy container in a browser-capable environment.\n\n' +
    'Suggested command:\n' +
    '  composer test Integration',
};
