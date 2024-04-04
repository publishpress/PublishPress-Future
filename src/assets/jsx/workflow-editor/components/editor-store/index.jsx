/*
 * WordPress dependencies
 */
import { register, createReduxStore, dispatch, select } from '@wordpress/data';

/*
 * Internal dependencies
 */
import {
    FEATURE_FULLSCREEN_MODE,
    INSERTER_TAB_TRIGGERS,
    SLOT_SCOPE_WORKFLOW_EDITOR,
} from '../../constants';
import { STORE_NAME } from './constants';


export const storeConfig = {
    activeFeatures: [FEATURE_FULLSCREEN_MODE],
    currentInserterTab: INSERTER_TAB_TRIGGERS,
    triggerCategories: [],
    triggerNodes: [],
    actionCategories: [],
    actionNodes: [],
    activeSidebarName: null,
}

export const store = createReduxStore(STORE_NAME, {
    reducer(state = storeConfig, action) {
        switch (action.type) {
            case 'SET_ACTIVE_FEATURES':
                return {
                    ...state,
                    activeFeatures: action.payload,
                };

            case 'TOGGLE_FEATURE':
                const feature = action.payload;

                let activeFeatures = [...state.activeFeatures];

                if (activeFeatures.includes(feature)) {
                    activeFeatures = activeFeatures.filter(f => f !== feature);
                } else {
                    activeFeatures.push(feature);
                }

                return {
                    ...state,
                    activeFeatures: activeFeatures,
                };
            case 'ENABLE_FEATURE':
                const featureToEnable = action.payload;

                return {
                    ...state,
                    activeFeatures: [...state.activeFeatures, featureToEnable],
                };

            case 'DISABLE_FEATURE':
                const featureToDisable = action.payload;

                return {
                    ...state,
                    activeFeatures: state.activeFeatures.filter(f => f !== featureToDisable),
                };

            case 'SET_CURRENT_INSERTER_TAB':
                return {
                    ...state,
                    currentInserterTab: action.payload,
                };

            case 'SET_TRIGGER_CATEGORIES':
                return {
                    ...state,
                    triggerCategories: action.payload,
                };


            case 'SET_TRIGGER_NODES':
                return {
                    ...state,
                    triggerNodes: action.payload,
                };

            case 'SET_ACTION_CATEGORIES':
                return {
                    ...state,
                    actionCategories: action.payload,
                };

            case 'SET_ACTION_NODES':
                return {
                    ...state,
                    actionNodes: action.payload,
                };

            case 'CLOSE_GENERAL_SIDEBAR':
                return {
                    ...state,
                    activeSidebarName: null,
                }

            case 'OPEN_GENERAL_SIDEBAR':
                return {
                    ...state,
                    activeSidebarName: action.payload,
                };
        }

        return state;
    },
    actions: {
        setActiveFeatures(activeFeatures) {
            return {
                type: 'SET_ACTIVE_FEATURES',
                payload: activeFeatures
            };
        },
        toggleFeature(feature) {
            return {
                type: 'TOGGLE_FEATURE',
                payload: feature
            };
        },
        disableFeature(feature) {
            return {
                type: 'DISABLE_FEATURE',
                payload: feature
            };
        },
        enableFeature(feature) {
            return {
                type: 'ENABLE_FEATURE',
                payload: feature
            };
        },
        setCurrentInserterTab(tab) {
            return {
                type: 'SET_CURRENT_INSERTER_TAB',
                payload: tab
            };
        },
        setTriggerCategories(categories) {
            return {
                type: 'SET_TRIGGER_CATEGORIES',
                payload: categories
            };
        },
        setTriggerNodes(nodes) {
            return {
                type: 'SET_TRIGGER_NODES',
                payload: nodes
            };
        },
        setActionCategories(categories) {
            return {
                type: 'SET_ACTION_CATEGORIES',
                payload: categories
            };
        },
        setActionNodes(nodes) {
            return {
                type: 'SET_ACTION_NODES',
                payload: nodes
            };
        },
        closeGeneralSidebar() {
            dispatch('core/interface').disableComplementaryArea(SLOT_SCOPE_WORKFLOW_EDITOR);

            return {
                type: 'CLOSE_GENERAL_SIDEBAR',
                payload: null
            };
        },
        openGeneralSidebar(sidebar) {
            dispatch('core/interface').enableComplementaryArea(SLOT_SCOPE_WORKFLOW_EDITOR, sidebar);

            return {
                type: 'OPEN_GENERAL_SIDEBAR',
                payload: sidebar
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
    }
});

register(store);

export default store;
