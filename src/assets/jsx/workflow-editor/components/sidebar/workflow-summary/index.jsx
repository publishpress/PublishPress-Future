import { PanelBody, TextControl, TextareaControl, __experimentalHStack as HStack } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { store as workflowStore } from '../../workflow-store';
import { useSelect, useDispatch } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { WorkflowSwitchToDraftButton } from '../../workflow-switch-to-draft-button';
import { WorkflowDeleteButton } from '../../workflow-delete-button';

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
        <PanelBody
            className='edit-post-post-status'
            title={__('Summary')}
            initialOpen={true}
            disabled={isLoadingWorkflow}
        >
            <HStack className="editor-post-title__panel">
                <TextControl
                    label={__('Title')}
                    value={workflowTitle}
                    onChange={onChangeTitle}
                    disabled={isLoadingWorkflow}
                />
            </HStack>

            <HStack className="editor-post-description__panel">
                <TextareaControl
                    label={__('Description')}
                    value={workflowDescription}
                    onChange={onChangeDescription}
                    disabled={isLoadingWorkflow}
                />
            </HStack>

            <HStack className="editor-post-status__panel">
                <WorkflowSwitchToDraftButton />
                <WorkflowDeleteButton />
            </HStack>

        </PanelBody>
    );
};

export default WorkflowSummary;
