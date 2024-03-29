import { KeyboardShortcuts as WPKeyboardShortcuts } from "@wordpress/components";
import { store } from "../store";
import { useDispatch, useSelect } from "@wordpress/data";
import { FEATURE_FULLSCREEN_MODE, FEATURE_INSERTER } from "../constants";
import { useReactFlow } from "reactflow";
import {
    SHORTCUT_ACTION_TOGGLE_FULLSCREEN,
    SHORTCUT_ACTION_FIT_VIEW,
    SHORTCUT_ACTION_TOGGLE_INSERTER,
    SHORTCUT_ACTION_AUTO_LAYOUT,
    shortcutsMap,
} from "../shortcuts";
import { useCallback } from "react";

export const KeyboardShortcuts = () => {
    const {
        toggleFeature,
    } = useDispatch(store);

    const toggleFullscreenMode = useCallback(() => {
        toggleFeature(FEATURE_FULLSCREEN_MODE);
    }, []);

    const toggleInserter = useCallback(() => {
        toggleFeature(FEATURE_INSERTER);
    }, []);

    const reactflow = useReactFlow();
    const fitView = useCallback(() => {
        reactflow.fitView();
    }, [reactflow]);


    const autoLayout = useCallback(() => {
        const customEvent = new CustomEvent('future_workflow_editor_auto_layout', {
            detail: {
                direction: 'DOWN',
            },
        });

        document.dispatchEvent(customEvent);
    }, []);

    const executeAction = useCallback((action) => {
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

            case SHORTCUT_ACTION_AUTO_LAYOUT:
                autoLayout();
                break;
        }
    }, []);

    const remapShortcuts = useCallback((shortcuts) => {
        let remapedShortcuts = {};

        for (const [action, keysCombination] of Object.entries(shortcuts)) {
            remapedShortcuts[keysCombination] = () => executeAction(action);
        }

        return remapedShortcuts;
    }, [shortcutsMap, executeAction]);

    return (
        <WPKeyboardShortcuts
            shortcuts={remapShortcuts(shortcutsMap)}
        />
    );
};
