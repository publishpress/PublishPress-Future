import { __ } from '@wordpress/i18n';
import { Button, FormFileUpload } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

const { apiFetch } = wp;

const ImportTab = () => {
    const [isImporting, setIsImporting] = useState(false);
    const [file, setFile] = useState(null);
    const [validFile, setValidFile] = useState(false);
    const [validationError, setValidationError] = useState(null);

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
        .then(result => {
            setIsImporting(false);
            createSuccessNotice(
                __('Settings imported successfully.', 'post-expirator'),
                {
                    type: 'snackbar',
                    isDismissible: true,
                    actions: [],
                    autoDismiss: true,
                    explicitDismiss: true,
                }
            );
        })
        .catch(error => {
            console.error('Upload error:', error);
            setIsImporting(false);
            createErrorNotice(
                error.message || __('Failed to import settings.', 'post-expirator'),
                {
                    type: 'snackbar',
                    isDismissible: true,
                    actions: [],
                    autoDismiss: true,
                    explicitDismiss: true,
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
        <div className="pe-settings-tab">
            <h2>{__('Import Settings', 'post-expirator')}</h2>

            <p>{__('Import the plugin settings or workflows from a .json file.', 'post-expirator')}</p>

            <FormFileUpload
                accept=".json,application/json,text/json,text/plain"
                onChange={ ( event ) => {
                    setFile( event.currentTarget.files[0] );
                    validateFile( event.currentTarget.files[0] );
                } }
            >
                {__('Select file', 'post-expirator')}
            </FormFileUpload>

            {file && (
                <>
                    <p>File selected: {file.name}</p>
                    <p>File size: {file.size} bytes</p>
                </>
            )}

            {validFile && (
                <Button isPrimary isBusy={isImporting} onClick={handleImport}>
                    {__('Import', 'post-expirator')}
                </Button>
            )}

            {validationError && (
                <p className="error">{validationError}</p>
            )}
        </div>
    );
};

export default ImportTab;
