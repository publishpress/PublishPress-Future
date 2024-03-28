import { KeyboardShortcuts as WPKeyboardShortcuts } from "@wordpress/components";
import { store } from "../store";
import { useDispatch, useSelect } from "@wordpress/data";
import { FEATURE_FULLSCREEN_MODE, FEATURE_INSERTER } from "../constants";
import { useReactFlow } from "reactflow";
import {
    SHORTCUT_ACTION_TOGGLE_FULLSCREEN,
    SHORTCUT_ACTION_FIT_VIEW,
    SHORTCUT_ACTION_TOGGLE_INSERTER,
} from "../shortcuts";

export const KeyboardShortcuts = () => {
    const {
        toggleFeature,
    } = useDispatch(store);

    const toggleFullscreenMode = () => {
        toggleFeature(FEATURE_FULLSCREEN_MODE);
    }

    const toggleInserter = () => {
        toggleFeature(FEATURE_INSERTER);
    }

    const reactflow = useReactFlow();
    const fitView = () => {
        reactflow.fitView();
    }

    const shortcutsMap = useSelect((select) => {
        return select(store).getShortcuts();
    });

    const executeAction = (action) => {
        switch (action) {
            case SHORTCUT_ACTION_TOGGLE_FULLSCREEN:
                toggleFullscreenMode();
                break;

            case SHORTCUT_ACTION_FIT_VIEW:
                fitView();
                break;

            case SHORTCUT_ACTION_TOGGLE_INSERTER:
                toggleInserter();
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
