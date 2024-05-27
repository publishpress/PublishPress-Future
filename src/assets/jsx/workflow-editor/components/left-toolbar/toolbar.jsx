/**
 * WordPress dependencies
 */
import { NavigableMenu } from '@wordpress/components';
import {
	useState,
	useRef,
	useEffect,
	useCallback,
} from '@wordpress/element';
import { focus } from '@wordpress/dom';


function getAllToolbarItemsIn( container ) {
	return Array.from( container.querySelectorAll( '[data-toolbar-item]' ) );
}

function hasFocusWithin( container ) {
	return container.contains( container.ownerDocument.activeElement );
}

function focusFirstTabbableIn( container ) {
	const [ firstTabbable ] = focus.tabbable.find( container );
	if ( firstTabbable ) {
		firstTabbable.focus();
	}
}

function useToolbarFocus(
	ref,
	focusOnMount,
	defaultIndex,
	onIndexChange
) {
	// Make sure we don't use modified versions of this prop
	const [ initialFocusOnMount ] = useState( focusOnMount );
	const [ initialIndex ] = useState( defaultIndex );

	const focusToolbar = useCallback( () => {
		focusFirstTabbableIn( ref.current );
	}, [] );

	// TODO: Focus on toolbar when pressing alt+F10 when the toolbar is visible

	useEffect( () => {
		if ( initialFocusOnMount ) {
			focusToolbar();
		}
	}, [ initialFocusOnMount, focusToolbar ] );

	useEffect( () => {
		// If initialIndex is passed, we focus on that toolbar item when the
		// toolbar gets mounted and initial focus is not forced.
		// We have to wait for the next browser paint because block controls aren't
		// rendered right away when the toolbar gets mounted.
		let raf = 0;
		if ( initialIndex && ! initialFocusOnMount ) {
			raf = window.requestAnimationFrame( () => {
				const items = getAllToolbarItemsIn( ref.current );
				const index = initialIndex || 0;
				if ( items[ index ] && hasFocusWithin( ref.current ) ) {
					items[ index ].focus();
				}
			} );
		}
		return () => {
			window.cancelAnimationFrame( raf );
			if ( ! onIndexChange || ! ref.current ) return;
			// When the toolbar element is unmounted and onIndexChange is passed, we
			// pass the focused toolbar item index so it can be hydrated later.
			const items = getAllToolbarItemsIn( ref.current );
			const index = items.findIndex( ( item ) => item.tabIndex === 0 );
			onIndexChange( index );
		};
	}, [ initialIndex, initialFocusOnMount ] );
}

export function NavigableToolbar( {
	children,
	focusOnMount,
	__experimentalInitialIndex: initialIndex,
	__experimentalOnIndexChange: onIndexChange,
	...props
} ) {
	const ref = useRef();

    useToolbarFocus(
		ref,
		focusOnMount,
		initialIndex,
		onIndexChange
	);

	return (
		<NavigableMenu
			orientation="horizontal"
			role="toolbar"
			ref={ ref }
			{ ...props }
		>
			{ children }
		</NavigableMenu>
	);
}
