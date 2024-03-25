import { useSelect, useDispatch } from '@wordpress/data';
import { Button, ToolbarItem } from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';
import { useRef, useCallback } from '@wordpress/element';
import { plus } from '@wordpress/icons';
import { store } from '../store';
import { FEATURE_FULLSCREEN_MODE, FEATURE_REDUCED_UI, FEATURE_INSERTER } from '../constants';
import { FullscreenModeClose } from './FullscreenModeClose';
import { MoreMenu } from './MoreMenu';
import { NavigableToolbar } from './NavigableToolbar';

const preventDefault = (event) => {
    event.preventDefault();
};

export const LayoutHeader = () => {
    const {
        isFullscreenActive,
        isInserterOpened,
        hasReducedUI,
        showIconLabels,
    } = useSelect((select) => {
        return {
            isFullscreenActive: select(store).isFeatureActive(FEATURE_FULLSCREEN_MODE),
            hasReducedUI: select(store).isFeatureActive(FEATURE_REDUCED_UI),
            isInserterOpened: select(store).isFeatureActive(FEATURE_INSERTER),
            showIconLabels: select(store).isFeatureActive(FEATURE_REDUCED_UI),
        }
    });

    const { enableFeature, disableFeature } = useDispatch(store);

    const headerClasses = 'edit-post-header ' + (hasReducedUI ? 'has-reduced-ui' : '');

    const inserterButton = useRef();

    const openInserter = useCallback(() => {
        if (isInserterOpened) {
            // Focusing the inserter button closes the inserter popover
            inserterButton.current.focus();
            disableFeature(FEATURE_INSERTER);
        } else {
            enableFeature(FEATURE_INSERTER);
        }
    }, [isInserterOpened, enableFeature]);

    /* translators: accessibility text for the editor toolbar */
    const toolbarAriaLabel = __('Document tools');

    return (
        <div className={headerClasses}>
            {isFullscreenActive &&
                <FullscreenModeClose />
            }

            <div className="edit-post-header__toolbar">
                <NavigableToolbar
                    className="edit-post-header-toolbar"
                    aria-label={toolbarAriaLabel}
                >
                    <div className="edit-post-header-toolbar__left">
                        <ToolbarItem
                            ref={inserterButton}
                            as={Button}
                            className="edit-post-header-toolbar__inserter-toggle"
                            variant="primary"
                            isPressed={isInserterOpened}
                            onMouseDown={preventDefault}
                            onClick={openInserter}
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
                                (!isInserterOpened ? __('Add') : __('Close'))}
                        </ToolbarItem>
                    </div>
                </NavigableToolbar>
            </div>
            <div className="edit-post-header__settings">
                <Button variant='link'>{__('Save Draft')}</Button>
                <Button variant='primary'>{__('Publish')}</Button>
                <MoreMenu />
            </div>
        </div>
    );
}
