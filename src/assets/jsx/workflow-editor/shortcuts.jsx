export const SHORTCUT_ACTION_TOGGLE_FULLSCREEN = 'toggleFullscreenMode';
export const SHORTCUT_ACTION_FIT_VIEW = 'fitView';
export const SHORTCUT_ACTION_TOGGLE_INSERTER = 'toggleInserter';

const SHORTCUT_PREFIX = 'mod+alt+shift+';

export const getShortcut = (key) => {
    return SHORTCUT_PREFIX + key;
}

let defaultShortcuts = {};
defaultShortcuts[SHORTCUT_ACTION_TOGGLE_FULLSCREEN] = getShortcut('f');
defaultShortcuts[SHORTCUT_ACTION_FIT_VIEW] = getShortcut('v');
defaultShortcuts[SHORTCUT_ACTION_TOGGLE_INSERTER] = getShortcut('i');

export const shortcutsMap = defaultShortcuts;
