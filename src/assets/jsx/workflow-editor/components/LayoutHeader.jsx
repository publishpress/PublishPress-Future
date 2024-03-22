import { useSelect } from '@wordpress/data';
import { store } from '../store';
import { FEATURE_FULLSCREEN_MODE, FEATURE_REDUCED_UI } from '../constants';
import { FullscreenModeClose } from './FullscreenModeClose';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export const LayoutHeader = () => {
    const {
        isFullscreenActive,
        hasReducedUI
    } = useSelect((select) => {
        return {
            isFullscreenActive: select(store).isFeatureActive(FEATURE_FULLSCREEN_MODE),
            hasReducedUI: select(store).isFeatureActive(FEATURE_REDUCED_UI),
        }
    });

    const headerClasses = 'edit-post-header ' + (hasReducedUI ? 'has-reduced-ui' : '');

    return (
        <div className={headerClasses}>
            {isFullscreenActive &&
                <FullscreenModeClose />
            }

            <div className="edit-post-header__toolbar">

            </div>
            <div className="edit-post-header__settings">
                <Button variant='link'>{__('Save Draft')}</Button>
                <Button variant='primary'>{__('Publish')}</Button>
            </div>
        </div>
    );
}
