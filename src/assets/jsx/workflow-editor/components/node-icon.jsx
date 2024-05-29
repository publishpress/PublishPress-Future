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
import { IoMdMail } from "react-icons/io";
import { BiSolidMessageDetail } from "react-icons/bi";
import { IoMdWarning } from "react-icons/io";

export function NodeIcon({ icon, showColors = false, className, size = 20}) {
	const iconSrc = icon?.src || icon;

	switch (iconSrc) {
		case 'block-default':
			icon = {
				src: blockDefault,
			};
			break;
		case 'document':
		case 'media-document':
			icon = {
				src: HiMiniDocumentText,
			};
			break;
		case 'users':
			icon = {
				src: FaUser,
			};
			break;
		case 'woo':
			icon = {
				src: SiWoo,
			};
			break;
		case 'fa6-fabug':
			icon = {
				src: FaBug,
			};
			break;
		case 'db-query':
			icon = {
				src: ImDatabase,
			};
			break;
		case 'route':
			icon = {
				src: TbRouteAltRight,
			};
			break;
		case 'email':
			icon = {
				src: IoMdMail,
			};
			break;
		case 'message':
			icon = {
				src: BiSolidMessageDetail,
			};
			break;
		case 'error':
			icon = {
				src: 'warning',
			};
			break;
		case 'warning':
			icon = {
				src: IoMdWarning,
			};
			break;
	}

	const mergedClassName = classnames(className, 'node-icon', {
		'has-colors': showColors,
	});

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
			className={mergedClassName}
		>
			{renderedIcon}
		</span>
	);
}

export default NodeIcon;
