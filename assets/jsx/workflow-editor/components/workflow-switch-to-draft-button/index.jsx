import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useViewportMatch } from '@wordpress/compose';

import { store as workflowStore } from '../workflow-store';

export function WorkflowSwitchToDraftButton() {
    const {
        isSavingWorkflow,
        isPublishedWorkflow,
        takeScreenshot,
    } = useSelect((select) => {
        return {
            isSavingWorkflow: select(workflowStore).isSavingWorkflow(),
            isPublishedWorkflow: select(workflowStore).isPublishedWorkflow(),
            takeScreenshot: select(workflowStore).takeScreenshot,
        };
    });

    const {
        switchToDraft,
    } = useDispatch(workflowStore);

    const isMobileViewport = useViewportMatch('small', '<');

    if (!isPublishedWorkflow) {
        return null;
    }

    const { enableWorkflowScreenshot } = futureWorkflowEditor;

    const onSwitch = () => {
        let alertMessage;

        if (isPublishedWorkflow) {
            alertMessage = __('Are you sure you want to unpublish this workflow?', 'post-expirator');
        }

        if (!alertMessage) {
            return;
        }

        if (window.confirm(alertMessage)) {
            if (enableWorkflowScreenshot) {
                takeScreenshot().then((dataUrl) => {
                    switchToDraft({ screenshot: dataUrl });
                });
            } else {
                switchToDraft();
            }
        }
    };

    return (
        <Button
            className='editor-post-switch-to-draft is-next-40px-default-size'
            onClick={onSwitch}
            disabled={isSavingWorkflow}
            variant='secondary'
        >
            {isMobileViewport ? __('Draft', 'post-expirator') : __('Switch to draft', 'post-expirator')}
        </Button>
    );
}

export default WorkflowSwitchToDraftButton;
