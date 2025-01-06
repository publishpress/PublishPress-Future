/**
 * WordPress dependencies
 */
import { Composite } from '@wordpress/components';

export { default as InserterListboxGroup } from './group';
export { default as InserterListboxRow } from './row';
export { default as InserterListboxItem } from './item';

export const InserterListbox = ({ children }) => {
	return (
		<Composite focusShift focusWrap="horizontal" render={ <></> }>
			{ children }
		</Composite>
	);
}

export default InserterListbox;
