import {
    useShortcut,
    store as shortcutStore,
} from '@wordpress/keyboard-shortcuts';
import { store as editorStore } from '../../store';
import { useEffect } from '@wordpress/element';
import {
    CUSTOM_EVENT_AUTO_LAYOUT,
    FEATURE_FULLSCREEN_MODE,
    FEATURE_INSERTER,
    AUTO_LAYOUT_RIGHT_DIRECTION
} from "../../constants";
import { useDispatch } from '@wordpress/data';
import {
    SHORTCUT_TOGGLE_FULLSCREEN,
    SHORTCUT_FIT_VIEW,
    SHORTCUT_TOGGLE_INSERTER,
    SHORTCUT_AUTO_LAYOUT,
    SHORTCUT_TOGGLE_SIDEBAR,
} from './constants';
import { useReactFlow } from 'reactflow';

export const KeyboardShortcuts = () => {
    const { registerShortcut } = useDispatch(shortcutStore);
    const {
        toggleFeature,
        setActiveSidebarName
    } = useDispatch(editorStore);

    useEffect(() => {
        registerShortcut({
            name: SHORTCUT_TOGGLE_FULLSCREEN,
            category: 'global',
            description: 'Toggle fullscreen mode',
            keyCombination: {
                modifier: 'secondary',
                character: 'f',
            }
        });

        registerShortcut({
            name: SHORTCUT_FIT_VIEW,
            category: 'global',
            description: 'Fit view',
            keyCombination: {
                modifier: 'secondary',
                character: 'v',
            }
        });

        registerShortcut({
            name: SHORTCUT_TOGGLE_INSERTER,
            category: 'global',
            description: 'Toggle inserter',
            keyCombination: {
                modifier: 'secondary',
                character: 'i',
            }
        });

        registerShortcut({
            name: SHORTCUT_AUTO_LAYOUT,
            category: 'global',
            description: 'Auto layout',
            keyCombination: {
                modifier: 'secondary',
                character: 'l',
            }
        });

        registerShortcut({
            name: SHORTCUT_TOGGLE_SIDEBAR,
            category: 'global',
            description: 'Toggle sidebar',
            keyCombination: {
                modifier: 'secondary',
                character: 's',
            }
        });
    }, []);

    useShortcut(SHORTCUT_TOGGLE_FULLSCREEN, () => {
        toggleFeature(FEATURE_FULLSCREEN_MODE);
    });

    const reactflow = useReactFlow();

    useShortcut(SHORTCUT_FIT_VIEW, () => {
        reactflow.fitView();
    });

    useShortcut(SHORTCUT_TOGGLE_INSERTER, () => {
        toggleFeature(FEATURE_INSERTER);
    });

    useShortcut(SHORTCUT_AUTO_LAYOUT, () => {
        const customEvent = new CustomEvent(CUSTOM_EVENT_AUTO_LAYOUT, {
            detail: {
                direction: AUTO_LAYOUT_RIGHT_DIRECTION,
            },
        });

        document.dispatchEvent(customEvent);
    });

    useShortcut(SHORTCUT_TOGGLE_SIDEBAR, () => {
        setActiveSidebarName(null);
    });

    return null;
}
