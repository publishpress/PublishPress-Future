import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import { CheckboxControl, Button, ToggleControl, Dashicon } from '@wordpress/components';
import { useState, useRef, useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
const { apiFetch } = wp;
import { SelectableList } from '../SelectableList';
import { SettingsTab } from '../SettingsTab';

const ExportTab = () => {
    const [exportActionWorkflows, setExportActionWorkflows] = useState(true);
    const [exportActionSettings, setExportActionSettings] = useState(true);
    const [includeScreenshots, setIncludeScreenshots] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [workflows, setWorkflows] = useState([]);
    const [selectedWorkflows, setSelectedWorkflows] = useState([]);
    const [selectedSettings, setSelectedSettings] = useState(['postTypesDefaults', 'general', 'notifications', 'display', 'advanced']);

    const apiRequestControllerRef = useRef(new AbortController());

    const settingsOptions = [
        {
            title: __('Post Types', 'post-expirator'),
            id: 'postTypesDefaults',
        },
        {
            title: __('General', 'post-expirator'),
            id: 'general',
        },
        {
            title: __('Notifications', 'post-expirator'),
            id: 'notifications',
        },
        {
            title: __('Display', 'post-expirator'),
            id: 'display',
        },
        {
            title: __('Advanced', 'post-expirator'),
            id: 'advanced',
        },
    ];

    const { createSuccessNotice, createErrorNotice } = useDispatch('core/notices');

    useEffect(() => {
        apiFetch({
            path: addQueryArgs(`publishpress-future/v1/backup/workflows`),
        }).then((result) => {
            setWorkflows(result.workflows);
            setSelectedWorkflows(result.workflows.map((workflow) => workflow.id));
        });
    }, []);

    const handleJsonDataDownload = (resultData) => {
        // Create a blob with the JSON data
        const jsonData = JSON.stringify(resultData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });

        // Create download link and trigger click
        const downloadUrl = URL.createObjectURL(blob);
        const date = new Date().toISOString().replace(':', '-').split('.')[0];
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `publishpress-future-backup-${date}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the URL object
        URL.revokeObjectURL(downloadUrl);
    };

    const handleExport = async () => {
        setIsExporting(true);

        const controller = apiRequestControllerRef.current;

        if (controller) {
            controller.abort();
        }

        apiRequestControllerRef.current = new AbortController();
        const { signal } = apiRequestControllerRef.current;

        apiFetch({
            path: addQueryArgs(`publishpress-future/v1/backup/export`),
            method: 'POST',
            data: {
                exportActionWorkflows: exportActionWorkflows,
                exportActionSettings: exportActionSettings,
                workflows: selectedWorkflows,
                includeScreenshots: includeScreenshots,
                settings: selectedSettings,
            },
            signal,
        }).then((result) => {
            setIsExporting(false);
            handleJsonDataDownload(result.data);

            createSuccessNotice(
                __('Settings exported successfully.', 'post-expirator'),
                {
                    type: 'snackbar',
                    isDismissible: true,
                    actions: [
                        {
                            label: __('Download', 'post-expirator'),
                            onClick: () => {
                                handleJsonDataDownload(result.data);
                            },
                        },
                    ],
                    icon: <Dashicon icon="yes" />,
                    autoDismiss: true,
                    explicitDismiss: true,
                }
            );
        }).catch((error) => {
            if (error.name === 'AbortError') {
                return;
            }

            createErrorNotice(
                error.message || __('Failed to export settings.', 'post-expirator'),
                {
                    type: 'snackbar',
                    isDismissible: true,
                    actions: [],
                    icon: <Dashicon icon="no" />,
                    autoDismiss: true,
                    explicitDismiss: true,
                }
            );

            setIsExporting(false);
        });
    };

    const handleExportCancel = () => {
        const controller = apiRequestControllerRef.current;

        if (controller) {
            controller.abort();
        }
    };

    const handleSelectAllSettings = () => {
        setSelectedSettings(settingsOptions.map((option) => option.value));
    };

    const handleUnselectAllSettings = () => {
        setSelectedSettings([]);
    };

    return (
        <SettingsTab
            title={__('Export Settings', 'post-expirator')}
            description={__('Export the plugin settings and workflows to a .json file. This file can be imported later to restore the data or migrate to another site.', 'post-expirator')}
        >
            <ul id="export-actions">
                <li key="export-action-workflows">
                    <CheckboxControl
                        label={__('Action Workflows', 'post-expirator')}
                        checked={exportActionWorkflows && workflows.length > 0}
                        onChange={(value) => setExportActionWorkflows(value)}
                        disabled={workflows.length === 0}
                    />

                    {exportActionWorkflows && workflows.length > 0 && (
                        <div className="pe-settings-tab__backup-container">
                            <div>
                                <ToggleControl
                                    label={__('Include screenshots', 'post-expirator')}
                                    checked={includeScreenshots}
                                    onChange={(value) => setIncludeScreenshots(value)}
                                />
                            </div>

                            <SelectableList items={workflows} selectedItems={selectedWorkflows} onSelect={setSelectedWorkflows} />
                        </div>
                    )}
                </li>
                <li key="export-action-settings">
                    <CheckboxControl
                        label={__('Action Settings', 'post-expirator')}
                        checked={exportActionSettings}
                        onChange={(value) => setExportActionSettings(value)}
                    />

                    {exportActionSettings && (
                        <div className="pe-settings-tab__backup-container">
                            <SelectableList items={settingsOptions} selectedItems={selectedSettings} onSelect={setSelectedSettings} />
                        </div>
                    )}
                </li>
            </ul>

            {(exportActionWorkflows || exportActionSettings) && (
                <Button isPrimary onClick={handleExport} isBusy={isExporting} disabled={isExporting}>
                    {isExporting ? __('Exporting...', 'post-expirator') : __('Export', 'post-expirator')}
                </Button>
            )}

            {isExporting && <Button isLink onClick={handleExportCancel} className="pe-settings-tab__export-cancel-button">{__('Cancel', 'post-expirator')}</Button>}
        </SettingsTab>
    );
};

export default ExportTab;
