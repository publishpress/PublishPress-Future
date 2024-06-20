/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon, blockDefault } from '@wordpress/icons';

export function InserterNoResults() {
	return (
		<div className="block-editor-inserter__no-results">
			<Icon
				className="block-editor-inserter__no-results-icon"
				icon={ blockDefault }
			/>
			<p>{__('No results found.', 'publishpress-future-pro')}</p>
		</div>
	);
}

export default InserterNoResults;
