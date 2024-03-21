import { register, createReduxStore } from '@wordpress/data';
import { FEATURE_FULLSCREEN_MODE, POST_TYPE, STORE_NAME } from './constants';

export const storeConfig = {
    activeFeatures: [FEATURE_FULLSCREEN_MODE],
    postType: POST_TYPE,
    nodes: [],
    edges: [],
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
        }
    }
});

register(store);
