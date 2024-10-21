/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Icon } from '@wordpress/components';
import { blockDefault } from '@wordpress/icons';
import WooIcon from './icons/woo';
import UserIcon from './icons/user';
import BugIcon from './icons/bug';
import DatabaseIcon from './icons/database';
import RouteRightIcon from './icons/route-right';
import MailIcon from './icons/mail';
import MessageIcon from './icons/message';
import WarningIcon from './icons/warning';
import ScheduleIcon from './icons/schedule';
import DocumentTextIcon from './icons/document-text';
import WebsiteIcon from './icons/website';
import ExclamationIcon from './icons/exclamation';
import LockIcon from './icons/lock';
import ShopIcon from './icons/shop';

export function NodeIcon({ icon, showColors = false, className, size = 20, onClick = () => {}, style = {} }) {
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
				src: DocumentTextIcon,
			};
			break;
		case 'users':
			icon = {
				src: UserIcon,
			};
			break;
		case 'woo':
			icon = {
				src: WooIcon,
			};
			break;
		case 'debug':
			icon = {
				src: BugIcon,
			};
			break;
		case 'db-query':
			icon = {
				src: DatabaseIcon,
			};
			break;
		case 'route':
			icon = {
				src: RouteRightIcon,
			};
			break;
		case 'email':
			icon = {
				src: MailIcon,
			};
			break;
		case 'message':
			icon = {
				src: MessageIcon,
			};
			break;
		case 'error':
			icon = {
				src: 'warning',
			};
			break;
		case 'warning':
			icon = {
				src: WarningIcon,
			};
			break;
		case 'schedule':
			icon = {
				src: ScheduleIcon,
			};
			break;
		case 'info':
			icon = {
				src: 'info',
			};
			break;
		case 'arrow-down':
			icon = {
				src: 'arrow-down',
			};
			break;
		case 'website':
			icon = {
				src: WebsiteIcon,
			};
			break;
		case 'exclamation':
			icon = {
				src: ExclamationIcon,
			};
			break;
		case 'lock':
			icon = {
				src: LockIcon,
			};
			break;
		case 'shop':
			icon = {
				src: ShopIcon,
			};
			break;
	}

	const mergedClassName = classnames(className, 'node-icon', {
		'has-colors': showColors,
	});

	const renderedIcon = <Icon icon={icon && icon.src ? icon.src : icon} size={size} />;
	const spanStyle = showColors
		? {
			...style,
			backgroundColor: icon && icon.background,
			color: icon && icon.foreground,
		}
		: style;

	return (
		<span style={spanStyle} className={mergedClassName} onClick={onClick}>
			{renderedIcon}
		</span>
	);
}

export default NodeIcon;
