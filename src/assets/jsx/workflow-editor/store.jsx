import { register, createReduxStore } from '@wordpress/data';
import { FEATURE_FULLSCREEN_MODE, POST_TYPE, STORE_NAME } from './constants';

export const storeConfig = {
    activeFeatures: [FEATURE_FULLSCREEN_MODE],
    postType: POST_TYPE,
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
        }
    }
});

register(store);
