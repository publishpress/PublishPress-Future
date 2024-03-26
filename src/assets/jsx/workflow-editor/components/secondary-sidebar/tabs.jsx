/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const triggersTab = {
    name: 'triggers',
    /* translators: Blocks tab title in the block inserter. */
    title: __('Triggers'),
};
const actionsTabs = {
    name: 'actions',
    /* translators: Patterns tab title in the block inserter. */
    title: __('Actions'),
};

function InserterTabs({
    children,
    onSelect,
}) {
    const tabs = useMemo(() => {
        const tempTabs = [triggersTab, actionsTabs];

        return tempTabs;
    }, [
        triggersTab,
        actionsTabs,
    ]);

    return (
        <TabPanel
            className="block-editor-inserter__tabs"
            tabs={tabs}
            onSelect={onSelect}
        >
            {children}
        </TabPanel>
    );
}

export default InserterTabs;
