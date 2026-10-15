export default {
  id: 'translate_commit',
  label: 'Commit translation updates',
  phase: 'Localization',
  type: 'confirm',
  instructions: (ctx) =>
    `Commit all translation files under languages/ in one commit for v${ctx.data.version}, then continue.`,
  message: (ctx) => `Commit all i18n/translation updates together:\n  git add languages/\n  git commit -m "Update translations for v${ctx.data.version}"\n\nThen continue.`,
};
