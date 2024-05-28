import { MenuGroup, MenuItem } from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';
import { useViewportMatch } from '@wordpress/compose';
import { displayShortcut } from '@wordpress/keycodes';
import { MoreMenuFeatureToggle } from './menu-feature-toggle';
import {
	FEATURE_FULLSCREEN_MODE,
	FEATURE_DEVELOPER_MODE,
	FEATURE_WELCOME_GUIDE,
	FEATURE_ADVANCED_SETTINGS,
	FEATURE_MINI_MAP,
} from '../../constants';

export const MoreMenuItemsView = () => {
	const isLargeViewport = useViewportMatch('medium');
	if (!isLargeViewport) {
		return null;
	}

	return (
		<>
			<MenuGroup label={_x('View', 'noun', 'publishpress-future-pro')}>
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
					feature={FEATURE_ADVANCED_SETTINGS}
					label={__('Advanced Settings', 'publishpress-future-pro')}
					info={__('Display advanced settings for the workflow, triggers and steps', 'publishpress-future-pro')}
					messageActivated={__('Advanced settings mode activated', 'publishpress-future-pro')}
					messageDeactivated={__('Advanced settings mode deactivated', 'publishpress-future-pro')}
					shortcut={displayShortcut.secondary('a')}
				/>
				<MoreMenuFeatureToggle
					scope="core/edit-post"
					feature={FEATURE_MINI_MAP}
					label={__('Display a mini map', 'publishpress-future-pro')}
					info={__('Display a mini map in the bottom of the editor, triggers and steps', 'publishpress-future-pro')}
					messageActivated={__('Mini map activated', 'publishpress-future-pro')}
					messageDeactivated={__('Mini map deactivated', 'publishpress-future-pro')}
				/>
			</MenuGroup>
			<MenuGroup label={__('Tools', 'publishpress-future-pro')}>
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
				<MenuItem
					icon="external"
					onClick={() => {
						window.open('https://publishpress.com/docs-category/future/', '_blank');
					}}
				>
					{__('Help', 'publishpress-future-pro')}
				</MenuItem>
			</MenuGroup>
		</>
	);
}
