import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

import ImportTab from './tabs-content/import';
import ExportTab from './tabs-content/export';
import TabbedWindow from './tabbed-window';

const BackupPanel = () => {
    const [activeTab, setActiveTab] = useState();

    const tabs = [
        {
            label: __('Export', 'post-expirator'),
            value: 'export',
        },
        {
            label: __('Import', 'post-expirator'),
            value: 'import',
        },
    ];

    return (
        <>
            <TabbedWindow
                tabs={tabs}
                defaultTab={tabs[0].value}
                onChange={setActiveTab}
        >
            {activeTab === 'import' && <ImportTab />}
                {activeTab === 'export' && <ExportTab />}
            </TabbedWindow>
        </>
    );
};

export default BackupPanel;
