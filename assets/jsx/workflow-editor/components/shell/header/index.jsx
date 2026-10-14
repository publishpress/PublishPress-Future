import { useSelect, useDispatch } from '@wordpress/data';
import { Button, ToolbarItem } from '@wordpress/components';
import { PinnedItems } from '@wordpress/interface';
import { __, _x } from '@wordpress/i18n';
import { useRef, useCallback } from '@wordpress/element';
import { plus, layout } from '@wordpress/icons';
import { store as editorStore } from '../../editor-store';
import { store as workflowStore } from '../../workflow-store';
import {
    FEATURE_FULLSCREEN_MODE,
    FEATURE_SHOW_ICON_LABELS,
    FEATURE_INSERTER,
    SLOT_SCOPE_WORKFLOW_EDITOR
} from '../../../constants';
import {
    AUTO_LAYOUT_DIRECTION_DOWN
} from '../../flow-editor/auto-layout/constants';
import { FullscreenModeClose } from './back-button';
import { MoreMenu } from './more-menu/menu';
import { NavigableToolbar } from './toolbar';
import { displayShortcut } from '@wordpress/keycodes';
import { WorkflowSaveDraftButton } from '../../workflow-save-draft-button';
import WorkflowPublishButton from '../../workflow-publish-button';
import { useAutoLayout } from '../../flow-editor/auto-layout/hooks';
import ShopIcon from '../../icons/shop';
import { useIsPro } from '../../../contexts/pro-context';
import '../header.css';

const preventDefault = (event) => {
    event.preventDefault();
};

export const LayoutHeader = () => {
    const {
        isFullscreenActive,
        isInserterOpened,
        showIconLabels,
        isLoadingWorkflow,
    } = useSelect((select) => {
        return {
            isFullscreenActive: select(editorStore).isFeatureActive(FEATURE_FULLSCREEN_MODE),
            isInserterOpened: select(editorStore).isFeatureActive(FEATURE_INSERTER),
            showIconLabels: select(editorStore).isFeatureActive(FEATURE_SHOW_ICON_LABELS),
            isLoadingWorkflow: select(workflowStore).isLoadingWorkflow(),
        }
    });

    const {
        enableFeature,
        disableFeature
    } = useDispatch(editorStore);

    const inserterButton = useRef();

    const openInserter = useCallback(() => {
        if (isInserterOpened) {
            // Focusing the inserter button closes the inserter popover
            inserterButton.current.focus();
            disableFeature(FEATURE_INSERTER);
            return;
        }

        enableFeature(FEATURE_INSERTER);
    }, [isInserterOpened, enableFeature, disableFeature]);

    /* translators: accessibility text for the editor toolbar */
    const toolbarAriaLabel = __('Document tools');

    const applyAutoLayout = useAutoLayout();

    const onAutoLayoutClick = useCallback((event) => {
        event.preventDefault();

        applyAutoLayout({
            direction: AUTO_LAYOUT_DIRECTION_DOWN,
        });
    });

    const onBuyProClick = useCallback((event) => {
        event.preventDefault();
        window.open('https://publishpress.com/links/future-workflow-toolbar', '_blank');
    });

    const isPro = useIsPro();

    return (
        <div className="future-workflow-editor-header">
            {isFullscreenActive &&
                <FullscreenModeClose />
            }

            <div className="future-workflow-editor-header__toolbar">
                <NavigableToolbar
                    aria-label={toolbarAriaLabel}
                >
                    <div className="future-workflow-editor-header__tools">
                        <ToolbarItem
                            ref={inserterButton}
                            as={Button}
                            className="future-workflow-editor-header__inserter-toggle"
                            variant="primary"
                            isPressed={isInserterOpened}
                            onMouseDown={preventDefault}
                            onClick={openInserter}
                            shortcut={displayShortcut.secondary('i')}
                            icon={plus}
                            /* translators: button label text should, if possible, be under 16
                    characters. */
                            label={_x(
                                'Toggle block inserter',
                                'Generic label for block inserter button'
                            )}
                            showTooltip={!showIconLabels}
                        >
                            {showIconLabels &&
                                (!isInserterOpened ? __('Add', 'post-expirator') : __('Close', 'post-expirator'))}
                        </ToolbarItem>

                        <ToolbarItem
                            as={Button}
                            onMouseDown={preventDefault}
                            onClick={onAutoLayoutClick}
                            icon={layout}
                            shortcut={displayShortcut.secondary('l')}
                            /* translators: button label text should, if possible, be under 16 characters. */
                            label={__('Auto Layout', 'post-expirator')}
                            showTooltip={!showIconLabels}
                            disabled={isLoadingWorkflow}
                        >
                            {showIconLabels &&
                                __('Auto Layout', 'post-expirator')
                            }
                        </ToolbarItem>

                        {!isPro && (
                            <ToolbarItem
                                as={Button}
                                className="future-workflow-editor-header__upgrade"
                                onMouseDown={preventDefault}
                                onClick={onBuyProClick}
                                icon={ShopIcon}
                                /* translators: button label text should, if possible, be under 16 characters. */
                                label={__('Upgrade to Pro and unlock more features', 'post-expirator')}
                                showTooltip={!showIconLabels}
                            >
                                {__('Upgrade to Pro', 'post-expirator')}
                            </ToolbarItem>
                        )}
                    </div>
                </NavigableToolbar>
            </div>
            <div className="future-workflow-editor-header__settings">
                <WorkflowSaveDraftButton />
                <WorkflowPublishButton />

                <PinnedItems.Slot scope={SLOT_SCOPE_WORKFLOW_EDITOR} />

                <MoreMenu />
            </div>
        </div>
    );
}
