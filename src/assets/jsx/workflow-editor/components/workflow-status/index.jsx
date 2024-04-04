import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export const WorkflowStatus = () => {
    return (
        <PanelBody
            className='edit-post-post-status'
            title={__('Summary')}
            initialOpen={true}
        >
            <TextControl
                label={__('Title')}
                value='My Workflow'
                onChange={() => {}}
            />

            <TextareaControl
                label={__('Description')}
                value='This is a workflow'
                onChange={() => {}}
            />
        </PanelBody>
    );
};

export default WorkflowStatus
