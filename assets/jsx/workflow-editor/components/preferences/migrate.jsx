/*
 * WordPress dependencies
 */
import { dispatch, select, subscribe } from "@wordpress/data";
import { store as preferencesStore } from "@wordpress/preferences";

/*
 * Internal dependencies
 */
import { FEATURE_FULLSCREEN_MODE } from "../../constants";
import {
    LEGACY_STORAGE_PREFIX,
    PANEL_BODY_STATES_KEY,
    PERSISTENT_FEATURES,
    PREFERENCES_SCOPE,
    PREFERENCE_DEFAULTS,
} from "./constants";

const readLegacyPreferences = (storageKey) => {
    try {
        const raw = window.localStorage.getItem(storageKey);

        if (raw === null) {
            return null;
        }

        const parsed = JSON.parse(raw);

        return parsed !== null && typeof parsed === "object" ? parsed : null;
    } catch (error) {
        return null;
    }
};

const removeLegacyPreferences = (storageKey) => {
    try {
        window.localStorage.removeItem(storageKey);
    } catch (error) {
        // Storage not available, nothing to clean.
    }
};

const extractLegacyFeatures = (stored) => {
    const features = {};
    const source = stored.persistentFeatures;

    if (source === null || typeof source !== "object") {
        return features;
    }

    Object.keys(source).forEach((feature) => {
        if (PERSISTENT_FEATURES.includes(feature)) {
            features[feature] = Boolean(source[feature]);
        }
    });

    return features;
};

const writeLegacyValues = (features, panelBodyStates) => {
    const { set } = dispatch(preferencesStore);

    Object.keys(features).forEach((feature) => {
        set(PREFERENCES_SCOPE, feature, features[feature]);
    });

    if (panelBodyStates !== null) {
        set(PREFERENCES_SCOPE, PANEL_BODY_STATES_KEY, panelBodyStates);
    }
};

/**
 * Registers preference defaults and migrates legacy localStorage values into
 * core/preferences. Call once, before the first render.
 */
export const bootPreferences = () => {
    dispatch(preferencesStore).setDefaults(
        PREFERENCES_SCOPE,
        PREFERENCE_DEFAULTS
    );

    const currentUserId = window.futureWorkflowEditor?.currentUserId;
    const storageKey = LEGACY_STORAGE_PREFIX + currentUserId;
    const stored = readLegacyPreferences(storageKey);

    if (stored === null) {
        return;
    }

    const features = extractLegacyFeatures(stored);
    const panelBodyStates =
        stored.panelBodyStates !== null &&
        typeof stored.panelBodyStates === "object"
            ? stored.panelBodyStates
            : null;

    writeLegacyValues(features, panelBodyStates);

    if (!Object.prototype.hasOwnProperty.call(features, FEATURE_FULLSCREEN_MODE)) {
        removeLegacyPreferences(storageKey);
        return;
    }

    // wp-preferences-persistence hydrates user meta asynchronously and can
    // overwrite the write above. Keep rewriting while this load is in flight,
    // then drop the legacy key. A matching read on an unrelated store update
    // is not proof that hydration finished.
    const legacyFullscreen = features[FEATURE_FULLSCREEN_MODE];
    let isDone = false;
    let fallbackTimer;
    let unsubscribe = () => {};

    const finish = () => {
        if (isDone) {
            return;
        }

        isDone = true;
        window.clearTimeout(fallbackTimer);
        removeLegacyPreferences(storageKey);
        unsubscribe();
    };

    const rewriteIfClobbered = () => {
        const current = select(preferencesStore).get(
            PREFERENCES_SCOPE,
            FEATURE_FULLSCREEN_MODE
        );

        if (current !== legacyFullscreen) {
            writeLegacyValues(features, panelBodyStates);
        }
    };

    unsubscribe = subscribe(() => {
        if (isDone) {
            return;
        }

        rewriteIfClobbered();
    });

    fallbackTimer = window.setTimeout(() => {
        rewriteIfClobbered();
        finish();
    }, 2000);
};
