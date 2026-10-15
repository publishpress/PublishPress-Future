export default {
  id: 'dep_review',
  label: 'Review dependency changes',
  phase: 'Dependencies',
  type: 'confirm',
  instructions:
    'Review the dry-run output. Apply composer updates and CHANGELOG notes if needed, or continue when dependencies are already current.',
  message: `Review the dry-run output above. If updates are needed:\n  1. Run: composer update the/lib:version-constraint\n  2. Lock versions if needed\n  3. Document changes in CHANGELOG.md\n\nOnce done (or if no updates needed), continue.`,
};
