/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { MenuItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { check } from '@wordpress/icons';
import { speak } from '@wordpress/a11y';

/**
 * Internal dependencies
 */
import { store } from '../store';

export const MoreMenuFeatureToggle = ({
    scope,
    label,
    info,
    messageActivated,
    messageDeactivated,
    shortcut,
    feature,
}) => {
    const isActive = useSelect(
        (select) =>
            select(store).isFeatureActive(feature),
        [feature]
    );
    const { toggleFeature } = useDispatch(store);
    const speakMessage = () => {
        if (isActive) {
            speak(messageDeactivated || __('Feature deactivated'));
        } else {
            speak(messageActivated || __('Feature activated'));
        }
    };

    return (
        <MenuItem
            icon={isActive && check}
            isSelected={isActive}
            onClick={() => {
                toggleFeature(feature);
                speakMessage();
            }}
            role="menuitemcheckbox"
            info={info}
            shortcut={shortcut}
        >
            {label}
        </MenuItem>
    );
}
