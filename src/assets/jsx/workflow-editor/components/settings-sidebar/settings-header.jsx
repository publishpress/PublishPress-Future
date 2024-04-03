/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
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

    const openDocumentSettings = () =>
        openGeneralSidebar(SIDEBAR_WORKFLOW);
    const openNodeSettings = () => openGeneralSidebar(SIDEBAR_NODE_EDGE);

    const { documentLabel } = useSelect((select) => {
        return {
            // translators: Default label for the Workflow sidebar tab, not selected.
            documentLabel: _x('Workflow', 'noun'),
        };
    }, []);

    const [documentAriaLabel, documentActiveClass] =
        sidebarName === SIDEBAR_WORKFLOW
            ? // translators: ARIA label for the Document sidebar tab, selected. %s: Document label.
            [sprintf(__('%s (selected)'), documentLabel), 'is-active']
            : [documentLabel, ''];

    const [nodeAriaLabel, nodeActiveClass] =
        sidebarName === SIDEBAR_NODE_EDGE
            ? // translators: ARIA label for the Node Settings Sidebar tab, selected.
            [__('Node (selected)'), 'is-active']
            : // translators: ARIA label for the Node Settings Sidebar tab, not selected.
            [__('Node'), ''];

    /* Use a list so screen readers will announce how many tabs there are. */
    return (
        <ul>
            <li>
                <Button
                    onClick={openDocumentSettings}
                    className={`edit-post-sidebar__panel-tab ${documentActiveClass}`}
                    aria-label={documentAriaLabel}
                    data-label={documentLabel}
                >
                    {documentLabel}
                </Button>
            </li>
            <li>
                <Button
                    onClick={openNodeSettings}
                    className={`edit-post-sidebar__panel-tab ${nodeActiveClass}`}
                    aria-label={nodeAriaLabel}
                    // translators: Data label for the Node Settings Sidebar tab.
                    data-label={__('Node')}
                >
                    {
                        // translators: Text label for the Node Settings Sidebar tab.
                        __('Node')
                    }
                </Button>
            </li>
        </ul>
    );
};

export default SettingsHeader;
