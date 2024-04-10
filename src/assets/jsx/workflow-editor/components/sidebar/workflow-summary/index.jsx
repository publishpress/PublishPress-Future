import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { store as workflowStore } from '../../workflow-store';
import { useSelect, useDispatch } from '@wordpress/data';

export const WorkflowSummary = () => {
    const {
        workflowTitle,
        workflowDescription,
    } = useSelect((select) => {
        return {
            workflowTitle: select(workflowStore).getEditedWorkflowAttribute('title'),
            workflowDescription: select(workflowStore).getEditedWorkflowAttribute('description'),
        }
    });

    const {
        setEditedWorkflowAttribute,
    } = useDispatch(workflowStore);

    const onChangeName = (name) => {
        setEditedWorkflowAttribute('name', name);
    }

    const onChangeDescription = (description) => {
        setEditedWorkflowAttribute('description', description);
    }

    return (
        <PanelBody
            className='edit-post-post-status'
            title={__('Summary')}
            initialOpen={true}
        >
            <TextControl
                label={__('Title')}
                value={workflowTitle}
                onChange={onChangeName}
            />

            <TextareaControl
                label={__('Description')}
                value={workflowDescription}
                onChange={onChangeDescription}
            />
        </PanelBody>
    );
};

export default WorkflowSummary;
