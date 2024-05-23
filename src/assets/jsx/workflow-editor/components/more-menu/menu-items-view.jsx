import { MenuGroup } from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';
import { useViewportMatch } from '@wordpress/compose';
import { displayShortcut } from '@wordpress/keycodes';
import { MoreMenuFeatureToggle } from './menu-feature-toggle';
import {
	FEATURE_FULLSCREEN_MODE,
	FEATURE_DEVELOPER_MODE,
	FEATURE_WELCOME_GUIDE,
} from '../../constants';

export const MoreMenuItemsView = () => {
	const isLargeViewport = useViewportMatch('medium');
	if (!isLargeViewport) {
		return null;
	}

	return (
		<MenuGroup label={_x('View', 'noun')}>
			<MoreMenuFeatureToggle
				scope="core/edit-post"
				feature={FEATURE_FULLSCREEN_MODE}
				label={__('Fullscreen mode', 'publishpress-future-pro')}
				info={__('Work without distraction', 'publishpress-future-pro')}
				messageActivated={__('Fullscreen mode activated', 'publishpress-future-pro')}
				messageDeactivated={__('Fullscreen mode deactivated', 'publishpress-future-pro')}
				shortcut={displayShortcut.secondary('f')}
			/>

			<MoreMenuFeatureToggle
				scope="core/edit-post"
				feature={FEATURE_DEVELOPER_MODE}
				label={__('Developer mode', 'publishpress-future-pro')}
				info={__('Work in developer mode', 'publishpress-future-pro')}
				messageActivated={__('Developer mode activated', 'publishpress-future-pro')}
				messageDeactivated={__('Developer mode deactivated', 'publishpress-future-pro')}
				shortcut={displayShortcut.secondary('d')}
			/>

			<MoreMenuFeatureToggle
				scope="core/edit-post"
				feature={FEATURE_WELCOME_GUIDE}
				label={__('Welcome guide', 'publishpress-future-pro')}
				info={__('Display the welcome guide', 'publishpress-future-pro')}
				messageActivated={__('Welcome guide activated', 'publishpress-future-pro')}
				messageDeactivated={__('Welcome guide deactivated', 'publishpress-future-pro')}
			/>
		</MenuGroup>
	);
}
