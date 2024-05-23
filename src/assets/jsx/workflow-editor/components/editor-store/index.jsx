/*
 * WordPress dependencies
 */
import { createReduxStore, dispatch, register } from "@wordpress/data";

/*
 * Internal dependencies
 */
import {
    FEATURE_DEVELOPER_MODE,
    FEATURE_FULLSCREEN_MODE,
    INSERTER_TAB_TRIGGERS,
    SLOT_SCOPE_WORKFLOW_EDITOR,
} from "../../constants";
import { STORE_NAME } from "./constants";

export const storeConfig = {
    activeFeatures: [],
    currentInserterTab: INSERTER_TAB_TRIGGERS,
    triggerCategories: [],
    triggerNodes: [],
    actionCategories: [],
    actionNodes: [],
    flowCategories: [],
    flowNodes: [],
    activeSidebarName: null,
    hoveredItem: null,
};

export const store = createReduxStore(STORE_NAME, {
    reducer(state = storeConfig, action) {
        switch (action.type) {
            case "SET_ACTIVE_FEATURES":
                // Update local storage for persisted features
                action.payload.forEach((feature) => {
                    if (persistentFeatures.includes(feature)) {
                        setPersistedFeatureValue(feature, true);
                    }
                });

                return {
                    ...state,
                    activeFeatures: action.payload,
                };

            case "TOGGLE_FEATURE":
                const feature = action.payload;

                let activeFeatures = [...state.activeFeatures];

                if (activeFeatures.includes(feature)) {
                    activeFeatures = activeFeatures.filter(
                        (f) => f !== feature,
                    );
                } else {
                    activeFeatures.push(feature);
                }

                // Update local storage for persisted features
                persistentFeatures.forEach((feature) => {
                    if (activeFeatures.includes(feature)) {
                        setPersistedFeatureValue(feature, true);
                    } else {
                        setPersistedFeatureValue(feature, false);
                    }
                });

                return {
                    ...state,
                    activeFeatures: activeFeatures,
                };
            case "ENABLE_FEATURE":
                const featureToEnable = action.payload;

                // Update local storage for persisted features
                if (persistentFeatures.includes(featureToEnable)) {
                    setPersistedFeatureValue(featureToEnable, true);
                }

                return {
                    ...state,
                    activeFeatures: [...state.activeFeatures, featureToEnable],
                };

            case "DISABLE_FEATURE":
                const featureToDisable = action.payload;

                // Update local storage for persisted features
                if (persistentFeatures.includes(featureToDisable)) {
                    setPersistedFeatureValue(featureToDisable, false);
                }

                return {
                    ...state,
                    activeFeatures: state.activeFeatures.filter(
                        (f) => f !== featureToDisable,
                    ),
                };

            case "SET_CURRENT_INSERTER_TAB":
                return {
                    ...state,
                    currentInserterTab: action.payload,
                };

            case "SET_TRIGGER_CATEGORIES":
                return {
                    ...state,
                    triggerCategories: action.payload,
                };

            case "SET_TRIGGER_NODES":
                return {
                    ...state,
                    triggerNodes: action.payload,
                };

            case "SET_ACTION_CATEGORIES":
                return {
                    ...state,
                    actionCategories: action.payload,
                };

            case "SET_ACTION_NODES":
                return {
                    ...state,
                    actionNodes: action.payload,
                };

            case "SET_FLOW_CATEGORIES":
                return {
                    ...state,
                    flowCategories: action.payload,
                };

            case "SET_FLOW_NODES":
                return {
                    ...state,
                    flowNodes: action.payload,
                };

            case "CLOSE_GENERAL_SIDEBAR":
                return {
                    ...state,
                    activeSidebarName: null,
                };

            case "OPEN_GENERAL_SIDEBAR":
                return {
                    ...state,
                    activeSidebarName: action.payload,
                };

            case "SET_HOVERED_ITEM":
                return {
                    ...state,
                    hoveredItem: action.payload,
                };
        }

        return state;
    },
    actions: {
        setActiveFeatures(activeFeatures) {
            return {
                type: "SET_ACTIVE_FEATURES",
                payload: activeFeatures,
            };
        },
        toggleFeature(feature) {
            return {
                type: "TOGGLE_FEATURE",
                payload: feature,
            };
        },
        disableFeature(feature) {
            return {
                type: "DISABLE_FEATURE",
                payload: feature,
            };
        },
        enableFeature(feature) {
            return {
                type: "ENABLE_FEATURE",
                payload: feature,
            };
        },
        setCurrentInserterTab(tab) {
            return {
                type: "SET_CURRENT_INSERTER_TAB",
                payload: tab,
            };
        },
        setTriggerCategories(categories) {
            return {
                type: "SET_TRIGGER_CATEGORIES",
                payload: categories,
            };
        },
        setTriggerNodes(nodes) {
            return {
                type: "SET_TRIGGER_NODES",
                payload: nodes,
            };
        },
        setActionCategories(categories) {
            return {
                type: "SET_ACTION_CATEGORIES",
                payload: categories,
            };
        },
        setActionNodes(nodes) {
            return {
                type: "SET_ACTION_NODES",
                payload: nodes,
            };
        },
        setFlowCategories(categories) {
            return {
                type: "SET_FLOW_CATEGORIES",
                payload: categories,
            };
        },
        setFlowNodes(nodes) {
            return {
                type: "SET_FLOW_NODES",
                payload: nodes,
            };
        },
        closeGeneralSidebar() {
            dispatch("core/interface").disableComplementaryArea(
                SLOT_SCOPE_WORKFLOW_EDITOR,
            );

            return {
                type: "CLOSE_GENERAL_SIDEBAR",
                payload: null,
            };
        },
        openGeneralSidebar(sidebar) {
            dispatch("core/interface").enableComplementaryArea(
                SLOT_SCOPE_WORKFLOW_EDITOR,
                sidebar,
            );

            return {
                type: "OPEN_GENERAL_SIDEBAR",
                payload: sidebar,
            };
        },
        setHoveredItem(item) {
            return {
                type: "SET_HOVERED_ITEM",
                payload: item,
            };
        },
    },
    selectors: {
        getActiveFeatures(state) {
            return state.activeFeatures;
        },
        isFeatureActive(state, feature) {
            return state.activeFeatures.includes(feature);
        },
        getCurrentInserterTab(state) {
            return state.currentInserterTab;
        },
        getTriggerCategories(state) {
            return state.triggerCategories;
        },
        getTriggerNodes(state) {
            return state.triggerNodes;
        },
        getActionCategories(state) {
            return state.actionCategories;
        },
        getActionNodes(state) {
            return state.actionNodes;
        },
        getFlowCategories(state) {
            return state.flowCategories;
        },
        getFlowNodes(state) {
            return state.flowNodes;
        },
        getHoveredItem(state) {
            return state.hoveredItem;
        },
    },
});

register(store);

// Persisted editor features
const LOCAL_SETTINGS_KEY =
    "FUTURE_PRO_WORKFLOW_PREFERENCES_" + futureWorkflowEditor.currentUserId;

const persistentFeatures = [FEATURE_FULLSCREEN_MODE, FEATURE_DEVELOPER_MODE];

const initLocalPreferences = () => {
    const localSettings = localStorage.getItem(LOCAL_SETTINGS_KEY);

    if (localSettings === null) {
        localStorage.setItem(
            LOCAL_SETTINGS_KEY,
            JSON.stringify({ persistentFeatures: {} }),
        );
    }
};

initLocalPreferences();

const getLocalPreferences = () => {
    return JSON.parse(localStorage.getItem(LOCAL_SETTINGS_KEY));
};

const setLocalPreferences = (settings) => {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
};

const getPersistedFeatureValue = (feature) => {
    const localSettings = getLocalPreferences();

    return localSettings.persistentFeatures[feature] || null;
};

const setPersistedFeatureValue = (feature, value) => {
    const localSettings = getLocalPreferences();

    localSettings.persistentFeatures[feature] = value;

    setLocalPreferences(localSettings);
};

// Enable fullscreen mode by default
if (getPersistedFeatureValue(FEATURE_FULLSCREEN_MODE) === null) {
    setPersistedFeatureValue(FEATURE_FULLSCREEN_MODE, true);
}

// Update the store with the persisted features
persistentFeatures.forEach((feature) => {
    if (getPersistedFeatureValue(feature)) {
        dispatch(store).enableFeature(feature);
    } else {
        dispatch(store).disableFeature(feature);
    }
});

export default store;
