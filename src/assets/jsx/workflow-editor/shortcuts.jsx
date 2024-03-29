function primaryShortcut(key) {
    return `mod+${key}`;
}

function secondaryShortcut(key) {
    return `mod+alt+shift+${key}`;
}

export const SHORTCUT_ACTION_TOGGLE_FULLSCREEN = 'toggleFullscreenMode';
export const SHORTCUT_ACTION_FIT_VIEW = 'fitView';
export const SHORTCUT_ACTION_TOGGLE_INSERTER = 'toggleInserter';
export const SHORTCUT_ACTION_AUTO_LAYOUT = 'autoLayout';

let defaultShortcuts = {};
defaultShortcuts[SHORTCUT_ACTION_TOGGLE_FULLSCREEN] = secondaryShortcut('f');
defaultShortcuts[SHORTCUT_ACTION_FIT_VIEW] = secondaryShortcut('v');
defaultShortcuts[SHORTCUT_ACTION_TOGGLE_INSERTER] = secondaryShortcut('i');
defaultShortcuts[SHORTCUT_ACTION_AUTO_LAYOUT] = secondaryShortcut('l');

export const shortcutsMap = defaultShortcuts;
