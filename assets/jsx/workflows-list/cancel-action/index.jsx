import { useState, useEffect, useCallback } from '@wordpress/element';
import { Modal, Button } from '@wordpress/components';
import { __, sprintf } from '@publishpress/i18n';
import { createRoot } from 'react-dom/client';
import './style.css';

const CancelActionsConfirmation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [actionData, setActionData] = useState({
        link: '',
        title: ''
    });

    const handleCancelActionsClick = useCallback((e) => {
        e.preventDefault();
        const link = e.target.href;
        const title = e.target.dataset.workflowTitle || '';
        setActionData({ link, title });
        setIsOpen(true);
    }, []);

    useEffect(() => {
        const cancelLinks = document.querySelectorAll('.pp-future-workflow-cancel-actions');

        cancelLinks.forEach(link => {
            link.addEventListener('click', handleCancelActionsClick);
        });

        return () => {
            cancelLinks.forEach(link => {
                link.removeEventListener('click', handleCancelActionsClick);
            });
        };
    }, [handleCancelActionsClick]);

    if (! isOpen) {
        return null;
    }

    const handleConfirm = () => {
        window.location.href = actionData.link;
    };

    return (
        <Modal
            title={__('Cancel Scheduled Actions', 'post-expirator')}
            onRequestClose={() => setIsOpen(false)}
            className="pp-future-cancel-actions-modal"
            style={{ maxWidth: '400px' }}
        >
            <p>
                {sprintf(
                    // translators: %s: Workflow title
                    __('Are you sure you want to cancel all scheduled actions for the "%s" workflow?', 'post-expirator'),
                    actionData.title
                )}
            </p>
            <div className="pp-future-cancel-actions-buttons">
                <Button
                    variant="secondary"
                    isDestructive={true}
                    onClick={handleConfirm}
                >
                    {__('Cancel Actions', 'post-expirator')}
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => setIsOpen(false)}
                >
                    {__('No', 'post-expirator')}
                </Button>
            </div>
        </Modal>
    );
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create container
    const modalContainer = document.createElement('div');
    modalContainer.id = 'pp-future-cancel-actions-container';
    document.body.appendChild(modalContainer);
    // Render the container
    const root = createRoot(modalContainer);
    root.render(<CancelActionsConfirmation />);
});
