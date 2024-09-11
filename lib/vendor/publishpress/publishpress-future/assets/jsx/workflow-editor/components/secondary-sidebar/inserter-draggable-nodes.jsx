/**
 * WordPress dependencies
 */
import { Draggable } from '@wordpress/components';
/**
 * Internal dependencies
 */
import NodeDraggableChip from './node-draggable-chip';

const InserterDraggableNodes = ({ isEnabled, node: node, icon, children }) => {
	const transferData = {
		type: 'node',
		node: node,
	};

	return (
		<Draggable
			__experimentalTransferDataType="node"
			transferData={transferData}
			__experimentalDragComponent={
				<NodeDraggableChip node={node} icon={icon} />
			}
		>
			{({ onDraggableStart, onDraggableEnd }) => {
				return children({
					draggable: isEnabled,
					onDragStart: isEnabled ? onDraggableStart : undefined,
					onDragEnd: isEnabled ? onDraggableEnd : undefined,
				});
			}}
		</Draggable>
	);
};

export default InserterDraggableNodes;
