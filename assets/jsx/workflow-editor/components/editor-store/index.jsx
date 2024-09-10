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
    FEATURE_WELCOME_GUIDE,
    FEATURE_ADVANCED_SETTINGS,
    FEATURE_MINI_MAP,
    FEATURE_CONTROLS,
    INSERTER_TAB_TRIGGERS,
    SLOT_SCOPE_WORKFLOW_EDITOR,
    FEATURE_INSERTER,
} from "../../constants";
import { STORE_NAME } from "./constants";

export const storeConfig = {
    activeFeatures: [],
    currentInserterTab: INSERTER_TAB_TRIGGERS,
    triggerCategories: [],
    triggerNodes: [],
    actionCategories: [],
    actionNodes: [],
    advancedCategories: [],
    advancedNodes: [],
    activeSidebarName: null,
    hoveredItem: null,
    panelBodyStates: {},
};

export const store = createReduxStore(STORE_NAME, {
    reducer(state = storeConfig, action) {
        let newActiveSidebarName;

        switch (action.type) {
            case "SET_ACTIVE_FEATURES":
                // Update local storage for persisted features
                action.payload.forEach((feature) => {
                    if (persistentFeatures.includes(feature)) {
                        setPersistedFeatureValue(feature, true);
                    }
                });

                // Close the sidebar when the inserter is enabled
                newActiveSidebarName = action.payload.includes(FEATURE_INSERTER) ? null : state.activeSidebarName;
                if (newActiveSidebarName === null) {
                    dispatch("core/interface").disableComplementaryArea(
                        SLOT_SCOPE_WORKFLOW_EDITOR,
                    );
                }

                return {
                    ...state,
                    activeFeatures: action.payload,
                    activeSidebarName: newActiveSidebarName,
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

                // Close the sidebar when the inserter is enabled
                newActiveSidebarName = activeFeatures.includes(FEATURE_INSERTER) ? null : state.activeSidebarName;
                if (newActiveSidebarName === null) {
                    dispatch("core/interface").disableComplementaryArea(
                        SLOT_SCOPE_WORKFLOW_EDITOR,
                    );
                }

                return {
                    ...state,
                    activeFeatures: activeFeatures,
                    activeSidebarName: newActiveSidebarName,
                };
            case "ENABLE_FEATURE":
                const featureToEnable = action.payload;

                // Update local storage for persisted features
                if (persistentFeatures.includes(featureToEnable)) {
                    setPersistedFeatureValue(featureToEnable, true);
                }

                const newActiveFeatures = [...state.activeFeatures, featureToEnable];

                // Close the sidebar when the inserter is enabled
                newActiveSidebarName = newActiveFeatures.includes(FEATURE_INSERTER) ? null : state.activeSidebarName;
                if (newActiveSidebarName === null) {
                    dispatch("core/interface").disableComplementaryArea(
                        SLOT_SCOPE_WORKFLOW_EDITOR,
                    );
                }

                return {
                    ...state,
                    activeFeatures: newActiveFeatures,
                    activeSidebarName: newActiveSidebarName,
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

            case "SET_ADVANCED_CATEGORIES":
                return {
                    ...state,
                    advancedCategories: action.payload,
                };

            case "SET_ADVANCED_NODES":
                return {
                    ...state,
                    advancedNodes: action.payload,
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
                    // Close the inserter when opening a sidebar
                    activeFeatures: state.activeFeatures.filter(
                        (f) => f !== FEATURE_INSERTER
                    ),
                };

            case "SET_HOVERED_ITEM":
                return {
                    ...state,
                    hoveredItem: action.payload,
                };

            case "SET_PANEL_BODY_STATE":
                const newState = {
                    ...state,
                    panelBodyStates: {
                        ...state.panelBodyStates,
                        [action.payload.panel]: action.payload.state,
                    },
                };

                setPersistedPanelBodyState(action.payload.panel, action.payload.state)

                return newState;
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
        setAdvancedCategories(categories) {
            return {
                type: "SET_ADVANCED_CATEGORIES",
                payload: categories,
            };
        },
        setAdvancedNodes(nodes) {
            return {
                type: "SET_ADVANCED_NODES",
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
        openInserter() {
            return {
                type: "ENABLE_FEATURE",
                payload: FEATURE_INSERTER,
            };
        },
        closeInserter() {
            return {
                type: "DISABLE_FEATURE",
                payload: FEATURE_INSERTER,
            };
        },
        setHoveredItem(item) {
            return {
                type: "SET_HOVERED_ITEM",
                payload: item,
            };
        },
        setPanelBodyState(panel, state) {
            return {
                type: "SET_PANEL_BODY_STATE",
                payload: { panel, state },
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
        getAdvancedCategories(state) {
            return state.advancedCategories;
        },
        getAdvancedNodes(state) {
            return state.advancedNodes;
        },
        getHoveredItem(state) {
            return state.hoveredItem;
        },
        getPanelBodyState(state, panel) {
            return state.panelBodyStates[panel];
        },
        getAllNodes(state) {
            return state.triggerNodes.concat(state.actionNodes, state.advancedNodes);
        },
        getNodeTypeByName(state, nodeName) {
            const allNodes = state.triggerNodes.concat(state.actionNodes, state.advancedNodes);
            return allNodes.find((n) => n.name === nodeName) || {};
        },
        isRayDebugInstalled(state) {
            return state.advancedNodes.some((node) => node.name === "advanced/ray.debug");
        }
    },
});

register(store);

// Persisted editor features
const LOCAL_SETTINGS_KEY =
    "FUTURE_PRO_WORKFLOW_PREFERENCES_" + futureWorkflowEditor.currentUserId;

const persistentFeatures = [
    FEATURE_FULLSCREEN_MODE,
    FEATURE_DEVELOPER_MODE,
    FEATURE_WELCOME_GUIDE,
    FEATURE_ADVANCED_SETTINGS,
    FEATURE_MINI_MAP,
    FEATURE_CONTROLS,
];

const initLocalPreferences = () => {
    const localSettings = localStorage.getItem(LOCAL_SETTINGS_KEY);

    if (localSettings === null) {
        localStorage.setItem(
            LOCAL_SETTINGS_KEY,
            JSON.stringify({
                persistentFeatures: {},
                panelBodyStates: {}
            }),
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

    return localSettings.persistentFeatures?.[feature];
};

const setPersistedFeatureValue = (feature, value) => {
    const localSettings = getLocalPreferences();

    if (! localSettings.persistentFeatures) {
        localSettings.persistentFeatures = {};
    }

    localSettings.persistentFeatures[feature] = value;

    setLocalPreferences(localSettings);
};


const getPersistedPanelBodyState = () => {
    const localSettings = getLocalPreferences();

    return localSettings.panelBodyStates || {};
};

const setPersistedPanelBodyState = (panel, state) => {
    const localSettings = getLocalPreferences();

    if (! localSettings.panelBodyStates) {
        localSettings.panelBodyStates = {};
    }

    localSettings.panelBodyStates[panel] = state;

    setLocalPreferences(localSettings);
}


// Enable fullscreen mode by default
const isFullscreenModeEnabled = getPersistedFeatureValue(FEATURE_FULLSCREEN_MODE);
if (isFullscreenModeEnabled === null || isFullscreenModeEnabled === undefined) {
    setPersistedFeatureValue(FEATURE_FULLSCREEN_MODE, true);
}

// Enable the welcome guide by default
const isWelcomeGuideEnabled = getPersistedFeatureValue(FEATURE_WELCOME_GUIDE);
if (isWelcomeGuideEnabled === null || isWelcomeGuideEnabled === undefined) {
    setPersistedFeatureValue(FEATURE_WELCOME_GUIDE, true);
}

// Enable controls by default
const isControlsFeatureEnabled = getPersistedFeatureValue(FEATURE_CONTROLS);
if (isControlsFeatureEnabled === null || isControlsFeatureEnabled === undefined) {
    setPersistedFeatureValue(FEATURE_CONTROLS, true);
}

// Update the store with the persisted features
persistentFeatures.forEach((feature) => {
    if (getPersistedFeatureValue(feature)) {
        dispatch(store).enableFeature(feature);
    } else {
        dispatch(store).disableFeature(feature);
    }
});

// Update the store with the persisted panel body states
const panelBodyStates = getPersistedPanelBodyState();
if (panelBodyStates) {
    Object.keys(panelBodyStates).forEach((panel) => {
        dispatch(store).setPanelBodyState(panel, panelBodyStates[panel]);
    });
}

export default store;
