/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useState } from '@wordpress/element';
import { Tip } from '@wordpress/components';

const globalTips = [
	createInterpolateElement(
		__(
			'Select multiple node by pressing <kbd>shift</kbd> when clicking and selecting in the workflow board.',
			'publishpress-future-pro'
		),
		{ kbd: <kbd /> }
	),
	__('Drag nodes from the inserter into the workflow', 'publishpress-future-pro'),
];

export function Tips() {
	const [ randomIndex ] = useState(
		// Disable Reason: I'm not generating an HTML id.
		// eslint-disable-next-line no-restricted-syntax
		Math.floor( Math.random() * globalTips.length )
	);

	return <Tip>{ globalTips[ randomIndex ] }</Tip>;
}
