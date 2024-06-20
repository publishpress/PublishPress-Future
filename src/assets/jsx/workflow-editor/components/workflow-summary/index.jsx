import { PanelRow, TextControl, TextareaControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { store as workflowStore } from '../workflow-store';
import { useSelect, useDispatch } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { WorkflowSwitchToDraftButton } from '../workflow-switch-to-draft-button';
import { WorkflowDeleteButton } from '../workflow-delete-button';
import PersistentPanelBody from '../persistent-panel-body';

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

    const onChangeTitle = useCallback((title) => {
        setEditedWorkflowAttribute('title', title);
    })

    const onChangeDescription = useCallback((description) => {
        setEditedWorkflowAttribute('description', description);
    })

    return (
        <PersistentPanelBody
            className='edit-post-post-status'
            title={__('Summary', 'publishpress-future-pro')}
            initialOpen={true}
            disabled={isLoadingWorkflow}
        >
            <PanelRow className="editor-post-title__panel">
                <TextControl
                    label={__('Title', 'publishpress-future-pro')}
                    value={workflowTitle}
                    onChange={onChangeTitle}
                    disabled={isLoadingWorkflow}
                />
            </PanelRow>

            <PanelRow className="editor-post-description__panel">
                <TextareaControl
                    label={__('Description', 'publishpress-future-pro')}
                    value={workflowDescription}
                    onChange={onChangeDescription}
                    disabled={isLoadingWorkflow}
                />
            </PanelRow>

            <PanelRow className="editor-post-status__panel">
                <WorkflowSwitchToDraftButton />
                <WorkflowDeleteButton />
            </PanelRow>
        </PersistentPanelBody>
    );
};

export default WorkflowSummary;
