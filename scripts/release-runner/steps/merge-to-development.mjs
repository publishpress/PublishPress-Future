export default {
  id: 'merge_to_development',
  label: 'Merge master to development',
  phase: 'Release',
  type: 'confirm',
  instructions: 'Merge master into development on GitHub so the development branch matches the released code.',
  message: 'Merge master → development on GitHub, then continue.',
};
