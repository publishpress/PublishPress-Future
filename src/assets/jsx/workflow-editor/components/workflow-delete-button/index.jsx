import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { compose, useViewportMatch } from '@wordpress/compose';

import { store as workflowStore } from '../workflow-store';

export function WorkflowDeleteButton() {
    const {
        isDeletingWorkflow,
    } = useSelect((select) => {
        return {
            isDeletingWorkflow: select(workflowStore).isDeletingWorkflow(),
        };
    });

    const {
        deleteWorkflow,
    } = useDispatch(workflowStore);

    const isMobileViewport = useViewportMatch('small', '<');

    const onClick = () => {
        const alertMessage = __('Are you sure you want to delete this workflow?', 'publishpress-future-pro');

        if (window.confirm(alertMessage)) {
            deleteWorkflow();
        }
    };

    return (
        <Button
            className='editor-post-delete-workflow is-next-40px-default-size'
            onClick={onClick}
            disabled={isDeletingWorkflow}
            variant='secondary'
            isDestructive={true}
        >
            {isMobileViewport ? __('Delete', 'publishpress-future-pro') : __('Move to trash', 'publishpress-future-pro')}
        </Button>
    );
}

export default WorkflowDeleteButton;
