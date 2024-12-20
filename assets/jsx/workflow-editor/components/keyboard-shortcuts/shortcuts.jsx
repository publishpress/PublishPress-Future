import {
    SHORTCUT_TOGGLE_FULLSCREEN,
    SHORTCUT_FIT_VIEW,
    SHORTCUT_TOGGLE_INSERTER,
    SHORTCUT_AUTO_LAYOUT,
    SHORTCUT_TOGGLE_SIDEBAR,
    SHORTCUT_TOGGLE_DEVELOPER_MODE,
    SHORTCUT_TOGGLE_ADVANCED_SETTINGS,
    SHORTCUT_SAVE_AS_CURRENT_STATUS,
} from "./constants";

export const SHORTCUTS_CONFIG = [
    {
        name: SHORTCUT_TOGGLE_FULLSCREEN,
        category: "global",
        description: "Toggle fullscreen mode",
        keyCombination: {
            modifier: "secondary",
            character: "f",
        },
    },
    {
        name: SHORTCUT_TOGGLE_DEVELOPER_MODE,
        category: "global",
        description: "Toggle developer mode",
        keyCombination: {
            modifier: "secondary",
            character: "d",
        },
    },
    {
        name: SHORTCUT_TOGGLE_ADVANCED_SETTINGS,
        category: "global",
        description: "Toggle advanced settings",
        keyCombination: {
            modifier: "secondary",
            character: "a",
        },
    },
    {
        name: SHORTCUT_FIT_VIEW,
        category: "global",
        description: "Fit view",
        keyCombination: {
            modifier: "secondary",
            character: "v",
        },
    },
    {
        name: SHORTCUT_TOGGLE_INSERTER,
        category: "global",
        description: "Toggle inserter",
        keyCombination: {
            modifier: "secondary",
            character: "i",
        },
    },
    {
        name: SHORTCUT_AUTO_LAYOUT,
        category: "global",
        description: "Auto layout",
        keyCombination: {
            modifier: "secondary",
            character: "l",
        },
    },
    {
        name: SHORTCUT_TOGGLE_SIDEBAR,
        category: "global",
        description: "Toggle sidebar",
        keyCombination: {
            modifier: "secondary",
            character: "s",
        },
    },
    {
        name: SHORTCUT_SAVE_AS_CURRENT_STATUS,
        category: "global",
        description: "Save as current status",
        keyCombination: {
            modifier: "primary",
            character: "s",
        },
    },
];
