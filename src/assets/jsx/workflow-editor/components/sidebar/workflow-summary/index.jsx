import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { store as workflowStore } from '../../workflow-store';
import { useSelect, useDispatch } from '@wordpress/data';

export const WorkflowSummary = () => {
    const {
        workflowTitle,
        workflowDescription,
        isLoadingWorkflow,
    } = useSelect((select) => {
        return {
            workflowTitle: select(workflowStore).getEditedWorkflowAttribute('title'),
            workflowDescription: select(workflowStore).getEditedWorkflowAttribute('description'),
            isLoadingWorkflow: select(workflowStore).isLoadingWorkflow(),
        }
    });

    const {
        setEditedWorkflowAttribute,
    } = useDispatch(workflowStore);

    const onChangeTitle = (title) => {
        setEditedWorkflowAttribute('title', title);
    }

    const onChangeDescription = (description) => {
        setEditedWorkflowAttribute('description', description);
    }

    return (
        <PanelBody
            className='edit-post-post-status'
            title={__('Summary')}
            initialOpen={true}
            disabled={isLoadingWorkflow}
        >
            <TextControl
                label={__('Title')}
                value={workflowTitle}
                onChange={onChangeTitle}
                disabled={isLoadingWorkflow}
            />

            <TextareaControl
                label={__('Description')}
                value={workflowDescription}
                onChange={onChangeDescription}
                disabled={isLoadingWorkflow}
            />
        </PanelBody>
    );
};

export default WorkflowSummary;
