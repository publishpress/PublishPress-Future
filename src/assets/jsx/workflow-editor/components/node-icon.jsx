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
import { FaBug } from 'react-icons/fa6';
import { ImDatabase } from "react-icons/im";
import { TbRouteAltRight } from "react-icons/tb";

export function NodeIcon({ icon, showColors = false, className, size = 20}) {
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

	if (iconSrc === 'fa6-fabug') {
		icon = {
			src: FaBug,
		};
	}

	if (iconSrc === 'db-query') {
		icon = {
			src: ImDatabase,
		};
	}

	if (iconSrc === 'route') {
		icon = {
			src: TbRouteAltRight,
		};
	}



	const renderedIcon = <Icon icon={icon && icon.src ? icon.src : icon} size={size} />;
	const style = showColors
		? {
			backgroundColor: icon && icon.background,
			color: icon && icon.foreground,
		}
		: {};

	return (
		<span
			style={style}
			className={classnames(className, {
				'has-colors': showColors,
			})}
		>
			{renderedIcon}
		</span>
	);
}

export default NodeIcon;
