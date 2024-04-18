/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Icon } from '@wordpress/components';
import { blockDefault } from '@wordpress/icons';
import { SiWoo } from 'react-icons/si';
import { FaUser } from 'react-icons/fa';
import { HiMiniDocumentText } from 'react-icons/hi2';

export function NodeIcon({ icon, showColors = false, className }) {
	const iconSrc = icon?.src || icon;

	if (iconSrc === 'block-default') {
		icon = {
			src: blockDefault,
		};
	}

	if (iconSrc === 'document' || iconSrc === 'media-document') {
		icon = {
			src: HiMiniDocumentText,
		};
	}

	if (iconSrc === 'users') {
		icon = {
			src: FaUser,
		};
	}

	if (iconSrc === 'woo') {
		icon = {
			src: SiWoo,
		};
	}

	const renderedIcon = <Icon icon={icon && icon.src ? icon.src : icon} />;
	const style = showColors
		? {
			backgroundColor: icon && icon.background,
			color: icon && icon.foreground,
		}
		: {};

	return (
		<span
			style={style}
			className={classnames('block-editor-block-icon', className, {
				'has-colors': showColors,
			})}
		>
			{renderedIcon}
		</span>
	);
}

export default NodeIcon;
