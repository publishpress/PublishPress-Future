import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

import ImportTab from './tabs-content/import';
import ExportTab from './tabs-content/export';

const BackupPanel = () => {
    const [activeTab, setActiveTab] = useState('export');

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
        <div id="pe-settings-tabs">
            <nav className="nav-tab-wrapper postexpirator-nav-tab-wrapper" id="postexpirator-nav">
                {tabs.map((tab) => (
                    <a
                        key={tab.value}
                        href="#"
                        className={`pe-tab nav-tab ${activeTab === tab.value ? 'nav-tab-active' : ''}`}
                        data-tab={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                    >
                        {tab.label}
                    </a>
                ))}
            </nav>
            {activeTab === 'import' && <ImportTab />}
            {activeTab === 'export' && <ExportTab />}
        </div>
    );
};

export default BackupPanel;
