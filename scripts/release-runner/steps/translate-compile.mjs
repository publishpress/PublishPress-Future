import { commitIfDirty } from './utils.mjs';

export default {
  id: 'translate_compile',
  label: 'Compile translation files (MO, JSON, PHP)',
  phase: 'Localization',
  type: 'auto',
  instructions: 'Compiles MO, JSON, and PHP translation files from PO sources and commits updates.',
  command: 'composer translate:compile',
  run: async (ctx) => {
    await ctx.exec('composer translate:compile');
    await commitIfDirty(ctx, `Compile translation files for v${ctx.data.version}`);
  },
};
