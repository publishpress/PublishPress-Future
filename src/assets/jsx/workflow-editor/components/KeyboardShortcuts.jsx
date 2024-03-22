import { KeyboardShortcuts as WPKeyboardShortcuts } from "@wordpress/components";
import { store } from "../store";
import { dispatch, useSelect } from "@wordpress/data";
import { FEATURE_FULLSCREEN_MODE } from "../constants";
import { useReactFlow } from "reactflow";
import {
    SHORTCUT_ACTION_TOGGLE_FULLSCREEN,
    SHORTCUT_ACTION_FIT_VIEW
} from "../shortcuts";

export const KeyboardShortcuts = () => {
    const toggleFullscreenMode = () => {
        dispatch(store).toggleFeature(FEATURE_FULLSCREEN_MODE);
    }

    const reactflow = useReactFlow();

    const shortcutsMap = useSelect((select) => {
        return select(store).getShortcuts();
    });

    const executeAction = (action) => {
        switch (action) {
            case SHORTCUT_ACTION_TOGGLE_FULLSCREEN:
                toggleFullscreenMode();
                break;

            case SHORTCUT_ACTION_FIT_VIEW:
                reactflow.fitView();
                break;
        }
    };

    const remapShortcuts = (shortcuts) => {
        let remapedShortcuts = {};

        for (const [action, keysCombination] of Object.entries(shortcuts)) {
            remapedShortcuts[keysCombination] = () => executeAction(action);
        }

        return remapedShortcuts;
    };

    const remapedShortcuts = remapShortcuts(shortcutsMap);

    return (
        <WPKeyboardShortcuts
            shortcuts={remapedShortcuts}
        />
    );
};
