import { MenuGroup } from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';
import { useViewportMatch } from '@wordpress/compose';
import { displayShortcut } from '@wordpress/keycodes';
import { MoreMenuFeatureToggle } from './MoreMenuFeatureToggle';

export const MoreMenuItemsView = () => {
	const isLargeViewport = useViewportMatch( 'medium' );
	if ( ! isLargeViewport ) {
		return null;
	}

	return (
		<MenuGroup label={ _x( 'View', 'noun' ) }>
			<MoreMenuFeatureToggle
				scope="core/edit-post"
				feature="fullscreenMode"
				label={ __( 'Fullscreen mode' ) }
				info={ __( 'Work without distraction' ) }
				messageActivated={ __( 'Fullscreen mode activated' ) }
				messageDeactivated={ __( 'Fullscreen mode deactivated' ) }
				shortcut={ displayShortcut.secondary( 'f' ) }
			/>
		</MenuGroup>
	);
}
