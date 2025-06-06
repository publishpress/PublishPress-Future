import { DropdownMenu } from '@wordpress/components';
import { __ } from '@publishpress/i18n';
import { moreVertical } from '@wordpress/icons';
import classnames from 'classnames';


export const MoreMenuDropdown = ( {
	as: DropdownComponent = DropdownMenu,
	className,
	/* translators: button label text should, if possible, be under 16 characters. */
	label = __('Options', 'post-expirator'),
	popoverProps,
	toggleProps,
	children,
} ) => {
    return (
		<DropdownComponent
			className={ classnames(
				'interface-more-menu-dropdown',
				className
			) }
			icon={ moreVertical }
			label={ label }
			popoverProps={ {
				position: 'bottom left',
				...popoverProps,
				className: classnames(
					'interface-more-menu-dropdown__content',
					popoverProps?.className
				),
			} }
			toggleProps={ {
				tooltipPosition: 'bottom',
				...toggleProps,
			} }
		>
			{ ( onClose ) => children( onClose ) }
		</DropdownComponent>
	);
}
