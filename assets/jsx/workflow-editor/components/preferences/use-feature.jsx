/*
 * WordPress dependencies
 */
import { useSelect, useDispatch, useRegistry } from "@wordpress/data";
import { store as preferencesStore } from "@wordpress/preferences";

/*
 * Internal dependencies
 */
import { store as editorStore } from "../editor-store";
import {
    PERSISTENT_FEATURES,
    PREFERENCES_SCOPE,
    PANEL_BODY_STATES_KEY,
} from "./constants";

const isPersistentFeature = (feature) => PERSISTENT_FEATURES.includes(feature);

/**
 * Whether a feature is active. Persistent features come from core/preferences,
 * session features from the editor store.
 */
export const useFeature = (feature) => {
    return useSelect(
        (select) => {
            if (isPersistentFeature(feature)) {
                return Boolean(
                    select(preferencesStore).get(PREFERENCES_SCOPE, feature)
                );
            }

            return select(editorStore).isFeatureActive(feature);
        },
        [feature]
    );
};

/**
 * Returns a function that toggles a feature.
 */
export const useToggleFeature = () => {
    const { toggle } = useDispatch(preferencesStore);
    const { toggleFeature } = useDispatch(editorStore);

    return (feature) => {
        if (isPersistentFeature(feature)) {
            toggle(PREFERENCES_SCOPE, feature);
            return;
        }

        toggleFeature(feature);
    };
};

/**
 * Returns a function that sets a persistent feature value.
 */
export const useSetFeature = (feature) => {
    const { set } = useDispatch(preferencesStore);

    return (value) => {
        if (isPersistentFeature(feature)) {
            set(PREFERENCES_SCOPE, feature, Boolean(value));
        }
    };
};

/**
 * Persisted open/closed state of panel bodies, keyed by panel id.
 */
export const usePanelBodyStates = () => {
    return useSelect((select) => {
        return (
            select(preferencesStore).get(PREFERENCES_SCOPE, PANEL_BODY_STATES_KEY) ??
            {}
        );
    }, []);
};

/**
 * Returns a function that updates one panel body state without mutating the
 * previous object.
 */
export const useSetPanelBodyState = () => {
    const { set } = useDispatch(preferencesStore);
    const registry = useRegistry();

    return (panelId, isOpened) => {
        const current =
            registry.select(preferencesStore).get(PREFERENCES_SCOPE, PANEL_BODY_STATES_KEY) ??
            {};

        set(PREFERENCES_SCOPE, PANEL_BODY_STATES_KEY, {
            ...current,
            [panelId]: isOpened,
        });
    };
};
