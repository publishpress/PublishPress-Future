/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useState } from '@wordpress/element';
import { Tip } from '@wordpress/components';

const globalTips = [
	createInterpolateElement(
		__(
			'Move to another step by pressing <kbd>backspace</kbd> when another step is selected.'
		),
		{ kbd: <kbd /> }
	),
	__( 'Drag nodes from the inserter into the workflow' ),
];

export function Tips() {
	const [ randomIndex ] = useState(
		// Disable Reason: I'm not generating an HTML id.
		// eslint-disable-next-line no-restricted-syntax
		Math.floor( Math.random() * globalTips.length )
	);

	return <Tip>{ globalTips[ randomIndex ] }</Tip>;
}
