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

export const store = createReduxStore(
    STORE_NAME,
    {
        reducer,
        actions,
        selectors,
        controls,
    }
);

register(store);

export default store;
