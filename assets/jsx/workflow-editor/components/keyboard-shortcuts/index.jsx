import {
    useShortcut,
    store as shortcutStore,
} from "@wordpress/keyboard-shortcuts";
import { store as editorStore } from "../editor-store";
import { store as workflowStore } from "../workflow-store";
import { useEffect } from "@wordpress/element";
import {
    FEATURE_ADVANCED_SETTINGS,
    FEATURE_DEVELOPER_MODE,
    FEATURE_FULLSCREEN_MODE,
    FEATURE_INSERTER,
} from "../../constants";
import {
    CUSTOM_EVENT_AUTO_LAYOUT,
    AUTO_LAYOUT_DIRECTION_DOWN,
} from "../flow-editor/auto-layout/constants";
import { useDispatch, useSelect } from "@wordpress/data";
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
import { useReactFlow } from "reactflow";
import { SHORTCUTS_CONFIG } from "./shortcuts";
export const KeyboardShortcuts = () => {
    const { registerShortcut } = useDispatch(shortcutStore);
    const { toggleFeature } = useDispatch(editorStore);
    const { takeScreenshot, saveAsCurrentStatus } = useDispatch(workflowStore);
    const reactflow = useReactFlow();

    const { isEditedWorkflowSaveable } = useSelect(
        (select) => ({
            isEditedWorkflowSaveable: select(workflowStore).isEditedWorkflowSaveable,
        }),
        []
    );

    useEffect(() => {
        SHORTCUTS_CONFIG.forEach((shortcut) => {
            registerShortcut(shortcut);
        });
    }, []);

    const handleSaveWithScreenshot =  async (e) => {
        e.preventDefault();

        if (!isEditedWorkflowSaveable) return;

        try {
            const { enableWorkflowScreenshot } = futureWorkflowEditor;

            if (enableWorkflowScreenshot) {
                const dataUrl = await takeScreenshot();
                await saveAsCurrentStatus({ screenshot: dataUrl });
            } else {
                await saveAsCurrentStatus();
            }
        } catch (error) {
            console.error('Failed to save workflow:', error);
        }
    }

    useShortcut(SHORTCUT_TOGGLE_FULLSCREEN, () => toggleFeature(FEATURE_FULLSCREEN_MODE));
    useShortcut(SHORTCUT_TOGGLE_DEVELOPER_MODE, () => toggleFeature(FEATURE_DEVELOPER_MODE));
    useShortcut(SHORTCUT_FIT_VIEW, () => reactflow.fitView());
    useShortcut(SHORTCUT_TOGGLE_INSERTER, () => toggleFeature(FEATURE_INSERTER  ));
    useShortcut(SHORTCUT_AUTO_LAYOUT, () => {
        document.dispatchEvent(new CustomEvent(CUSTOM_EVENT_AUTO_LAYOUT, {
            detail: {
                direction: AUTO_LAYOUT_DIRECTION_DOWN,
            },
        }));
    });
    useShortcut(SHORTCUT_TOGGLE_ADVANCED_SETTINGS, () => toggleFeature(FEATURE_ADVANCED_SETTINGS));
    useShortcut(SHORTCUT_SAVE_AS_CURRENT_STATUS, handleSaveWithScreenshot);

    return null;
};

