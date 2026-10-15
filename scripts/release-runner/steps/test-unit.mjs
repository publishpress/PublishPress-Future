export default {
  id: 'test_unit',
  label: 'Unit tests (run externally)',
  phase: 'Testing',
  type: 'manual',
  command: 'composer test Unit',
  instructions:
    'Confirms core plugin logic before merge; run outside the deploy container if your setup needs extra services.\n\n' +
    'Suggested command:\n' +
    '  composer test Unit',
};
