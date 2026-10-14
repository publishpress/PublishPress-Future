/**
 * WordPress dependencies
 */
import { MenuItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { check } from '@wordpress/icons';
import { speak } from '@wordpress/a11y';

/**
 * Internal dependencies
 */
import { useFeature, useToggleFeature } from '../../../preferences/use-feature';

export const MoreMenuFeatureToggle = ({
    scope,
    label,
    info,
    messageActivated,
    messageDeactivated,
    shortcut,
    feature,
}) => {
    const isActive = useFeature(feature);
    const toggleFeature = useToggleFeature();
    const speakMessage = () => {
        if (isActive) {
            speak(messageDeactivated || __('Feature deactivated', 'post-expirator'));
        } else {
            speak(messageActivated || __('Feature activated', 'post-expirator'));
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
