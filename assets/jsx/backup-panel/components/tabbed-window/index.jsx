import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

const TabbedWindow = ({
    defaultTab = '',
    tabs = [
        {
            label: 'Tab 1',
            value: 'tab1',
        },
        {
            label: 'Tab 2',
            value: 'tab2',
        },
    ],
    onChange = () => {},
    children,
}) => {
    const getCurrentTabFromUrl = () => {
        const hash = window.location.hash.replace('#', '');
        const theTab = tabs.find((tab) => tab.value === hash) || defaultTab;

        if (typeof theTab === 'object') {
            return theTab.value;
        }

        return theTab;
    };

    const [activeTab, setActiveTab] = useState(getCurrentTabFromUrl());

    // Listen for hash changes
    useEffect(() => {
        const handleHashChange = () => {
            const newTab = getCurrentTabFromUrl();
            setActiveTab(newTab);
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        window.history.replaceState(null, '', `#${activeTab}`);

        onChange(activeTab);
    }, [activeTab]);

    return (
        <div id="pe-settings-tabs">
            <nav className="nav-tab-wrapper postexpirator-nav-tab-wrapper" id="postexpirator-nav">
                {tabs.map((tab) => (
                    <a
                        key={tab.value}
                        href="#"
                        className={`pe-tab nav-tab ${activeTab === tab.value ? 'nav-tab-active' : ''}`}
                        data-tab={tab.value}
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveTab(tab.value);
                        }}
                    >
                        {tab.label}
                    </a>
                ))}
            </nav>
            {children}
        </div>
    );
};

export default TabbedWindow;
