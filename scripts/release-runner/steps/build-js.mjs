import { commitIfDirty } from './utils.mjs';

export default {
  id: 'build_js',
  label: 'Build JavaScript assets',
  phase: 'Code Quality',
  type: 'auto',
  instructions: 'Builds admin JavaScript bundles and auto-commits any changed assets under assets/.',
  command: 'composer build:js',
  run: async (ctx) => {
    await ctx.exec('composer build:js');
    await commitIfDirty(ctx, 'Build JavaScript assets');
  },
};
