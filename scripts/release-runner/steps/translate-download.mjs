import { commitIfDirty } from './utils.mjs';

export default {
  id: 'translate_download',
  label: 'Download updated translations',
  phase: 'Localization',
  type: 'auto',
  instructions: 'Downloads updated community translations and commits changes when files differ.',
  command: 'composer translate:download',
  run: async (ctx) => {
    await ctx.exec('composer translate:download');
    await commitIfDirty(ctx, `Download updated translations for v${ctx.data.version}`);
  },
};
