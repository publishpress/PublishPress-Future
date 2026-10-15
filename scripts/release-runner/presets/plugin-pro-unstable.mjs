import { pluginProStablePreset } from './plugin-pro-stable.mjs';
import { withoutSteps } from './without-steps.mjs';

/** Prerelease (beta/rc) pro pipeline — no milestone bookkeeping. */
export const pluginProUnstablePreset = withoutSteps(pluginProStablePreset, [
  'milestone_check',
  'milestone_close',
]);
