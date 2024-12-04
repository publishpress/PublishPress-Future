import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { SnackbarList } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

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

    const notices = useSelect(select => select('core/notices').getNotices());

    return (
        <>
            <SnackbarList notices={notices} />
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
