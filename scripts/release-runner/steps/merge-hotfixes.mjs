export default {
  id: 'merge_hotfixes',
  label: 'Merge hotfixes/features into release branch',
  phase: 'Pre-flight & Branch Setup',
  type: 'confirm',
  instructions:
    'Merge pending hotfixes or features into the release branch (direct merge or PR) before dependency and quality checks.',
  message: 'Merge any pending hotfixes or features into the release branch now (via direct merge or PR), then continue.',
};
