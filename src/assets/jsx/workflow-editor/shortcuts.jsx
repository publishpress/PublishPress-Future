export const SHORTCUT_ACTION_TOGGLE_FULLSCREEN = 'toggleFullscreenMode';
export const SHORTCUT_ACTION_FIT_VIEW = 'fitView';

let defaultShortcuts = {};
defaultShortcuts[SHORTCUT_ACTION_TOGGLE_FULLSCREEN] = 'ctrl+enter';
defaultShortcuts[SHORTCUT_ACTION_FIT_VIEW] = 'ctrl+f';

export const shortcutsMap = defaultShortcuts;
