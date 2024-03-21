import { useSelect } from '@wordpress/data';
import { store } from '../store';
import { FEATURE_FULLSCREEN_MODE, FEATURE_REDUCED_UI } from '../constants';
import { FullscreenModeClose } from './FullscreenModeClose';

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

    const headerClasses = 'edit-workflow-header ' + (hasReducedUI ? 'has-reduced-ui' : '');

    return (
        <div className={headerClasses}>
            {isFullscreenActive &&
                <FullscreenModeClose />
            }
            <h2>Workflow Editor</h2>
        </div>
    );
}
