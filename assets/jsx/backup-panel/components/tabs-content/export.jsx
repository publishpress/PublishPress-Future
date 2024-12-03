import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import { CheckboxControl, Button, ToggleControl } from '@wordpress/components';
import { useState, useRef, useEffect } from '@wordpress/element';

const { apiFetch } = wp;

const ExportTab = () => {
    const [exportActionWorkflows, setExportActionWorkflows] = useState(true);
    const [exportActionSettings, setExportActionSettings] = useState(true);
    const [includeScreenshots, setIncludeScreenshots] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [workflows, setWorkflows] = useState([]);
    const [selectedWorkflows, setSelectedWorkflows] = useState([]);

    const apiRequestControllerRef = useRef(new AbortController());

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
            },
            signal,
        }).then((result) => {
            setIsExporting(false);
            handleJsonDataDownload(result.data);
        }).catch((error) => {
            if (error.name === 'AbortError') {
                return;
            }

            setIsExporting(false);
        });
    };

    const handleExportCancel = () => {
        const controller = apiRequestControllerRef.current;

        if (controller) {
            controller.abort();
        }
    };

    const handleSelectAllWorkflows = () => {
        setSelectedWorkflows(workflows.map((workflow) => workflow.id));
    };

    const handleUnselectAllWorkflows = () => {
        setSelectedWorkflows([]);
    };

    return (
        <div className="pe-settings-tab">
            <h2>{__('Export Settings', 'post-expirator')}</h2>

            <p>{__('Export the plugin settings and workflows to a .json file. This file can be imported later to restore the data or migrate to another site.', 'post-expirator')}</p>

            <ul id="export-actions">
                <li key="export-action-workflows">
                    <CheckboxControl
                        label={__('Action Workflows', 'post-expirator')}
                        checked={exportActionWorkflows && workflows.length > 0}
                        onChange={(value) => setExportActionWorkflows(value)}
                        disabled={workflows.length === 0}
                    />

                    {exportActionWorkflows && workflows.length > 0 && (
                        <div className="pe-settings-tab__workflows-container">
                            <div>
                                <ToggleControl
                                    label={__('Include screenshots', 'post-expirator')}
                                    checked={includeScreenshots}
                                    onChange={(value) => setIncludeScreenshots(value)}
                                />
                            </div>
                            <div>
                                <span className="pe-settings-tab__workflow-actions">
                                    <Button isLink onClick={handleSelectAllWorkflows}>{__('Select all', 'post-expirator')}</Button> |
                                    <Button isLink onClick={handleUnselectAllWorkflows}>{__('Unselect all', 'post-expirator')}</Button>
                                </span>
                            </div>

                            <ul>
                                {workflows.map((workflow) => (
                                    <li key={workflow.id}>
                                        <CheckboxControl
                                            label={(
                                                <>
                                                    {workflow.title}
                                                    <span className="pe-settings-tab__workflow-status">[{workflow.status}]</span>
                                                </>
                                            )}
                                            checked={selectedWorkflows.includes(workflow.id)}
                                            onChange={(value) => {
                                                if (value) {
                                                    setSelectedWorkflows([...selectedWorkflows, workflow.id]);
                                                } else {
                                                    setSelectedWorkflows(selectedWorkflows.filter((id) => id !== workflow.id));
                                                }
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </li>
                <li key="export-action-settings">
                    <CheckboxControl
                        label={__('Action Settings', 'post-expirator')}
                        checked={exportActionSettings}
                        onChange={(value) => setExportActionSettings(value)}
                    />
                </li>
            </ul>

            {(exportActionWorkflows || exportActionSettings) && (
                <Button isPrimary onClick={handleExport} isBusy={isExporting} disabled={isExporting}>
                    {isExporting ? __('Exporting...', 'post-expirator') : __('Export', 'post-expirator')}
                </Button>
            )}

            {isExporting && <Button isLink onClick={handleExportCancel} className="pe-settings-tab__export-cancel-button">{__('Cancel', 'post-expirator')}</Button>}
        </div>
    );
};

export default ExportTab;
