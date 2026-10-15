export default {
  id: 'wait_translator_pt_br',
  label: 'Wait for PT-BR translation review',
  phase: 'Localization',
  type: 'manual',
  instructions: (ctx) =>
    [
      `Open a GitHub issue titled: "Translate and Review PT-BR for Release v${ctx.data.version}"`,
      'Assign it to @ValdemirMaran.',
      'Do not attach ZIP, .pot, or translation files.',
      'Wait for @ValdemirMaran to review and confirm or close the issue.',
    ].join('\n'),
};
