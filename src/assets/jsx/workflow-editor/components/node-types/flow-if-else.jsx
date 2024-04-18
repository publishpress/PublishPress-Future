import { Handle, Position } from 'reactflow';
import { memo } from '@wordpress/element';

export const FlowIfElseNode = memo(({ data, isConnectable }) => {
    return (
        <>
            <Handle
                type="target"
                position={Position.Top}
                id="socket-input"
                style={{ left: '50%', background: '#000' }}
                isConnectable={isConnectable}
            />
            <div className='react-flow__node-label'>
                {data.label}
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                id="socket-true"
                style={{ left: '40%', background: 'blue' }}
                isConnectable={isConnectable}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="socket-false"
                style={{ left: '60%', background: 'red' }}
                isConnectable={isConnectable}
            />
        </>
    );
});

export default FlowIfElseNode;
