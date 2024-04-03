/**
 * WordPress dependencies
 */
import { TabPanel } from '../../components/tab-panel';
import { __, _x, sprintf } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
*/
import { store } from '../../store';
import {
    SIDEBAR_NODE_EDGE,
    SIDEBAR_WORKFLOW
} from './constants';

export const SettingsHeader = ({ sidebarName }) => {
    const { openGeneralSidebar } = useDispatch(store);

    const { documentLabel } = useSelect((select) => {
        return {
            // translators: Default label for the Workflow sidebar tab, not selected.
            documentLabel: _x('Workflow', 'noun'),
        };
    }, []);

    /* Use a list so screen readers will announce how many tabs there are. */
    return (
        <TabPanel
            tabs={[
                {
                    name: SIDEBAR_WORKFLOW,
                    title: documentLabel,
                },
                {
                    name: SIDEBAR_NODE_EDGE,
                    title: __('Element'),
                },
            ]}
            onSelect={(tabName) => {
                openGeneralSidebar(tabName);
            }}
            initialTabName={sidebarName}
        >
            {
                () => null
            }
        </TabPanel>
    );
};

export default SettingsHeader;
