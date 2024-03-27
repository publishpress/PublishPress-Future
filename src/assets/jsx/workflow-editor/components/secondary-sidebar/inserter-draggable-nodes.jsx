/**
 * WordPress dependencies
 */
import { Draggable } from '@wordpress/components';
/**
 * Internal dependencies
 */
import NodeDraggableChip from './node-draggable-chip';

const InserterDraggableNodes = ( { isEnabled, nodes, icon, children } ) => {
	const transferData = {
		type: 'inserter',
		nodes,
	};

	return (
		<Draggable
			__experimentalTransferDataType="nodes"
			transferData={ transferData }
			__experimentalDragComponent={
				<NodeDraggableChip count={ nodes.length } icon={ icon } />
			}
		>
			{ ( { onDraggableStart, onDraggableEnd } ) => {
				return children( {
					draggable: isEnabled,
					onDragStart: isEnabled ? onDraggableStart : undefined,
					onDragEnd: isEnabled ? onDraggableEnd : undefined,
				} );
			} }
		</Draggable>
	);
};

export default InserterDraggableNodes;
