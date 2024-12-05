import { __ } from '@wordpress/i18n';
import { Button, FormFileUpload, Dashicon } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { SettingsTab } from '../settings-tab';

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const ImportTab = () => {
    const [isImporting, setIsImporting] = useState(false);
    const [file, setFile] = useState(null);
    const [validFile, setValidFile] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const { createSuccessNotice, createErrorNotice } = useDispatch('core/notices');

    const handleImport = () => {
        setIsImporting(true);

        // Create FormData object
        const formData = new FormData();
        formData.append('backupFile', file);

        const wpNonce = wp.apiFetch.nonceMiddleware ? wp.apiFetch.nonceMiddleware.nonce : '';

        fetch(`${futureBackupPanelData.apiRoot}publishpress-future/v1/backup/import`, {
            method: 'POST',
            headers: {
                'X-WP-Nonce': wpNonce
            },
            body: formData,
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(response => {
            if (response.ok) {
                setIsImporting(false);
                createSuccessNotice(
                    response.message || __('Settings imported successfully.', 'post-expirator'),
                    {
                        type: 'snackbar',
                        isDismissible: true,
                        actions: [],
                        autoDismiss: true,
                        explicitDismiss: true,
                        icon: <Dashicon icon="yes" />,
                    }
                );
            } else {
                throw new Error(response.message);
            }
        })
        .catch(error => {
            setIsImporting(false);
            createErrorNotice(
                error || __('Failed to import settings.', 'post-expirator'),
                {
                    type: 'snackbar',
                    isDismissible: true,
                    actions: [],
                    autoDismiss: true,
                    explicitDismiss: true,
                    icon: <Dashicon icon="warning" />,
                }
            );
        });
    };

    const validateFile = (fileToValidate) => {
        const fileExtension = fileToValidate.name.split('.').pop();

        if (fileExtension !== 'json') {
            setValidFile(false);
            setValidationError(__('Invalid file type. Please upload a .json file.', 'post-expirator'));

            return;
        }

        setValidFile(true);
        setValidationError(null);
    };


    return (
        <SettingsTab
            title={__('Import Settings', 'post-expirator')}
            description={__('Import the plugin settings or workflows from a .json file.', 'post-expirator')}
        >
            <div
                className="pe-settings-tab__import-file-upload"
            >
                <div
                    className={`pe-dropzone ${isDragging ? 'pe-dropzone--active' : ''}`}
                    onDrop={(e) => {
                        e.preventDefault();
                        const droppedFile = e.dataTransfer.files[0];
                        setFile(droppedFile);
                        validateFile(droppedFile);
                    }}
                    onDragOver={(e) => {
                        e.preventDefault();
                    }}
                    onDragEnter={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        if (e.currentTarget === e.target) {
                            setIsDragging(false);
                        }
                    }}
                >
                    <p>{__('Drop your .json file here', 'post-expirator')}</p>
                    <p>{__('or', 'post-expirator')}</p>

                    <FormFileUpload
                        accept=".json,application/json,text/json,text/plain"
                        onChange={ ( event ) => {
                            setFile( event.currentTarget.files[0] );
                            validateFile( event.currentTarget.files[0] );
                        } }
                        className="is-primary"
                    >
                        {__('Select a .json file', 'post-expirator')}
                    </FormFileUpload>

                    {file && (
                        <div className="pe-settings-tab__import-file-upload-info">
                            <p>{__('Selected file', 'post-expirator')}: {file.name}</p>
                            <p>{__('File size', 'post-expirator')}: {formatFileSize(file.size)}</p>
                        </div>
                    )}
                </div>
            </div>


            {validFile && (
                <Button isPrimary isBusy={isImporting} onClick={handleImport}>
                    {__('Import', 'post-expirator')}
                </Button>
            )}

            {validationError && (
                <p className="error">{validationError}</p>
            )}
        </SettingsTab>
    );
};

export default ImportTab;
