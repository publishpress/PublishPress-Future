/*
 * WordPress dependencies
 */
import { register, createReduxStore } from '@wordpress/data';

/*
 * Internal dependencies
 */
import { STORE_NAME } from './name';
import reducer, { DEFAULT_STATE } from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
import { default as controls} from './controls';

// Only create the store if not already created
if (! window.futureWorkflowManualSelectionStore) {
    window.futureWorkflowManualSelectionStore = createReduxStore(
        STORE_NAME,
        {
            reducer,
            actions,
            selectors,
            controls,
        }
    );

    register(window.futureWorkflowManualSelectionStore);
}

export const store = window.futureWorkflowManualSelectionStore;
export default store;
