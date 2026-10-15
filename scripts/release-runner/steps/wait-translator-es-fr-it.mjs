export default {
  id: 'wait_translator_es_fr_it',
  label: 'Wait for ES, FR, IT translation review',
  phase: 'Localization',
  type: 'manual',
  instructions: (ctx) =>
    [
      `Open a GitHub issue titled: "Translate and Review ES, FR, and IT for Release v${ctx.data.version}"`,
      'Assign it to @wocmultimedia.',
      'Do not attach ZIP, .pot, or translation files.',
      'Wait for @wocmultimedia to review and confirm or close the issue.',
    ].join('\n'),
};
