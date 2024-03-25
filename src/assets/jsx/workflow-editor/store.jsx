import { register, createReduxStore } from '@wordpress/data';
import {
    FEATURE_FULLSCREEN_MODE,
    POST_TYPE,
    STORE_NAME
} from './constants';
import { shortcutsMap } from './shortcuts';

export const storeConfig = {
    activeFeatures: [FEATURE_FULLSCREEN_MODE],
    postType: POST_TYPE,
    shortcuts: shortcutsMap,
    nodes: [],
    edges: [],
    editorUndo: [],
    editorRedo: [],
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

            case 'SET_SHORTCUTS':
                return {
                    ...state,
                    shortcuts: action.payload,
                };

            case 'SET_SHORTCUT':
                const { actionToExecute, keysCombination } = action.payload;

                return {
                    ...state,
                    shortcuts: {
                        ...state.shortcuts,
                        [actionToExecute]: keysCombination,
                    }
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
        setShortcuts(shortcuts) {
            return {
                type: 'SET_SHORTCUTS',
                payload: shortcuts
            };
        },
        setShortcut(actionToExecute, keysCombination) {
            return {
                type: 'SET_SHORTCUT',
                payload: { actionToExecute, keysCombination }
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
        getShortcuts(state) {
            return state.shortcuts;
        },
        getShortcut(state, actionToExecute) {
            return state.shortcuts[actionToExecute];
        },
        getNodes(state) {
            return state.nodes;
        },
        getEdges(state) {
            return state.edges;
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
