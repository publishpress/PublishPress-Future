export default {
  id: 'pin_free_lib',
  label: 'Pin Free plugin version in lib/composer.json',
  phase: 'Dependencies',
  type: 'manual',
  instructions: () =>
    [
      'Update lib/composer.json to reference the recently released Free plugin tag',
      '(e.g. 4.7.0) instead of a branch reference.',
      'Run composer update in lib/ if needed, then commit the change.',
    ].join('\n'),
};
