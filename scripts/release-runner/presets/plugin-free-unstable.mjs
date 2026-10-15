import { pluginFreeStablePreset } from './plugin-free-stable.mjs';
import { withoutSteps } from './without-steps.mjs';

/** Prerelease (beta/rc) free pipeline — no milestone or post-publish WP.org gates. */
export const pluginFreeUnstablePreset = withoutSteps(pluginFreeStablePreset, [
  'milestone_check',
  'milestone_close',
  'post_release',
  'check_wporg',
]);
