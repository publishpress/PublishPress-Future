import { __ } from '@wordpress/i18n';
import { CheckboxControl, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';

const ImportTab = () => {
    return (
        <div className="pe-settings-tab">
            <h2>{__('Import Settings', 'post-expirator')}</h2>

            <p>{__('Import the plugin settings or workflows from a .json file.', 'post-expirator')}</p>


            <Button isPrimary>
                {__('Import', 'post-expirator')}
            </Button>
        </div>
    );
};

export default ImportTab;
