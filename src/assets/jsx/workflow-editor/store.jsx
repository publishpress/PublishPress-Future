import { register, createReduxStore } from '@wordpress/data';
import {
    FEATURE_FULLSCREEN_MODE,
    INSERTER_TAB_TRIGGERS,
    POST_TYPE,
    STORE_NAME
} from './constants';

export const storeConfig = {
    activeFeatures: [FEATURE_FULLSCREEN_MODE],
    postType: POST_TYPE,
    nodes: [],
    edges: [],
    editorUndo: [],
    editorRedo: [],
    currentInserterTab: INSERTER_TAB_TRIGGERS,
    triggerCategories: [],
    triggerNodes: [],
    actionNodes: [],
    selectedNodes: [],
    selectedEdges: [],
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

            case 'SET_POST_TYPE':
                return {
                    ...state,
                    postType: action.payload,
                };

            case 'SET_NODES':
                return {
                    ...state,
                    nodes: action.payload,
                };

            case 'SET_EDGES':
                return {
                    ...state,
                    edges: action.payload,
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

            case 'SET_SELECTED_NODES':
                return {
                    ...state,
                    selectedNodes: action.payload,
                };

            case 'SET_SELECTED_EDGES':
                return {
                    ...state,
                    selectedEdges: action.payload,
                };

            case 'UNDO':
                // TODO: Implement undo
                return {
                    ...state
                };

            case 'REDO':
                // TODO: Implement redo
                return {
                    ...state
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
        setPostType(postType) {
            return {
                type: 'SET_POST_TYPE',
                payload: postType
            };
        },
        setNodes(nodes) {
            return {
                type: 'SET_NODES',
                payload: nodes
            };
        },
        setEdges(edges) {
            return {
                type: 'SET_EDGES',
                payload: edges
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
        setSelectedNodes(nodes) {
            return {
                type: 'SET_SELECTED_NODES',
                payload: nodes
            };
        },
        setSelectedEdges(edges) {
            return {
                type: 'SET_SELECTED_EDGES',
                payload: edges
            };
        },
        undo() {
            return {
                type: 'UNDO'
            };
        },
        redo() {
            return {
                type: 'REDO'
            };
        }
    },
    selectors: {
        getActiveFeatures(state) {
            return state.activeFeatures;
        },
        isFeatureActive(state, feature) {
            return state.activeFeatures.includes(feature);
        },
        getPostType(state) {
            return state.postType;
        },
        getNodes(state) {
            return state.nodes;
        },
        getEdges(state) {
            return state.edges;
        },
        getNodeById(state, id) {
            return state.nodes.find(node => node.id === id);
        },
        getEdgeById(state, id) {
            return state.edges.find(edge => edge.id === id);
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
        getSelectedNodes(state) {
            return state.selectedNodes;
        },
        getSelectedEdges(state) {
            return state.selectedEdges;
        },
        hasEditorUndo(state) {
            return state.editorUndo.length > 0;
        },
        hasEditorRedo(state) {
            return state.editorRedo.length > 0;
        }
    }
});

register(store);
