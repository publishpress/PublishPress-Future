/**
 * External dependencies
 */
import { classnames } from '../../utils';

/**
 * WordPress dependencies
 */
import { Icon } from '@wordpress/components';
import { blockDefault } from '@wordpress/icons';
import { SiWoo } from 'react-icons/si';
import { FaUser } from 'react-icons/fa';
import { HiMiniDocumentText } from 'react-icons/hi2';

export default function NodeIcon( { icon, showColors = false, className } ) {
	if ( icon?.src === 'block-default' ) {
		icon = {
			src: blockDefault,
		};
	}

	if ( icon?.src === 'document' ) {
		icon = {
			src: HiMiniDocumentText,
		};
	}

	if ( icon?.src === 'users' ) {
		icon = {
			src: FaUser,
		};
	}

	if ( icon?.src === 'woo' ) {
		icon = {
			src: SiWoo,
		};
	}

	console.log(icon);

	const renderedIcon = <Icon icon={ icon && icon.src ? icon.src : icon } />;
	const style = showColors
		? {
				backgroundColor: icon && icon.background,
				color: icon && icon.foreground,
		  }
		: {};

	return (
		<span
			style={ style }
			className={ classnames( 'block-editor-block-icon', className, {
				'has-colors': showColors,
			} ) }
		>
			{ renderedIcon }
		</span>
	);
}
