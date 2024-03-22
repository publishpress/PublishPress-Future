export const SHORTCUT_ACTION_TOGGLE_FULLSCREEN = 'toggleFullscreenMode';
export const SHORTCUT_ACTION_FIT_VIEW = 'fitView';

const SHORTCUT_PREFIX = 'mod+alt+shift+';

export const getShortcut = (key) => {
    return SHORTCUT_PREFIX + key;
}

let defaultShortcuts = {};
defaultShortcuts[SHORTCUT_ACTION_TOGGLE_FULLSCREEN] = getShortcut('f');
defaultShortcuts[SHORTCUT_ACTION_FIT_VIEW] = getShortcut('v');

export const shortcutsMap = defaultShortcuts;
