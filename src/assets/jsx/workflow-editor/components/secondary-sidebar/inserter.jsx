/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { close } from '@wordpress/icons';
import {
    useViewportMatch,
    __experimentalUseDialog as useDialog,
} from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { store } from '../../store';
import { FEATURE_MOST_USED_NODES, FEATURE_INSERTER } from '../../constants';
import { InserterLibrary } from './library';

export function InserterSidebar() {
    const { showMostUsedNodes } = useSelect((select) => {
        return {
            showMostUsedNodes: select(store).isFeatureActive(FEATURE_MOST_USED_NODES),
        };
    }, []);

    const { disableFeature } = useDispatch(store);

    const closeInserter = () => {
        disableFeature(FEATURE_INSERTER);
    };

    const isMobileViewport = useViewportMatch('medium', '<');
    const [inserterDialogRef, inserterDialogProps] = useDialog({
        onClose: () => closeInserter(),
    });

    return (
        <div
            ref={inserterDialogRef}
            {...inserterDialogProps}
            className="edit-post-editor__inserter-panel"
        >
            <div className="edit-post-editor__inserter-panel-header">
                <Button
                    icon={close}
                    onClick={() => closeInserter()}
                />
            </div>
            <div className="edit-post-editor__inserter-panel-content">
                <InserterLibrary
                    showMostUsedNodes={showMostUsedNodes}
                    showInserterHelpPanel={true}
                    shouldFocusBlock={isMobileViewport}
                />
            </div>
        </div>
    );
}
