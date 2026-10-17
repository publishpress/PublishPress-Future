/*
 * WordPress dependencies
 */
import { createReduxStore, dispatch, register } from "@wordpress/data";

/*
 * Internal dependencies
 */
import {
    INSERTER_TAB_TRIGGERS,
    SLOT_SCOPE_WORKFLOW_EDITOR,
    FEATURE_INSERTER,
} from "../../constants";
import { STORE_NAME } from "./constants";

const isPro = futureWorkflowEditor.isPro || false;

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
    isPro: isPro,
    currentConditionalQuery: null,
};

export const store = createReduxStore(STORE_NAME, {
    reducer(state = storeConfig, action) {
        let newActiveSidebarName;

        switch (action.type) {
            case "SET_ACTIVE_FEATURES":
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

            case "SET_CURRENT_CONDITIONAL_QUERY":
                return {
                    ...state,
                    currentConditionalQuery: action.payload,
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
        setCurrentConditionalQuery(query) {
            return {
                type: "SET_CURRENT_CONDITIONAL_QUERY",
                payload: query,
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
        getAllNodes(state) {
            return state.triggerNodes.concat(state.actionNodes, state.advancedNodes);
        },
        getNodeTypeByName(state, nodeName) {
            const allNodes = state.triggerNodes.concat(state.actionNodes, state.advancedNodes);
            return allNodes.find((n) => n.name === nodeName) || {};
        },
        isRayDebugInstalled(state) {
            return state.advancedNodes.some((node) => node.name === "advanced/ray.debug");
        },
        isPro(state) {
            return state.isPro;
        },
        getCurrentConditionalQuery(state) {
            return state.currentConditionalQuery;
        },
    },
});

register(store);

export default store;
