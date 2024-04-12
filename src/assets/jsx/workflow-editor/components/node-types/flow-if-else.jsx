import { Handle, Position } from 'reactflow';
import { memo } from '@wordpress/element';

export const FlowIfElseNode = memo(({ data, isConnectable }) => {
    return (
        <>
            <div>
                Custom Color Picker Node: <strong>{data.color}</strong>
            </div>
            <input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />
            <Handle
                type="source"
                position={Position.Bottom}
                id="a"
                style={{ left: '50%', background: '#555' }}
                isConnectable={isConnectable}
            />
        </>
    );
});

export default FlowIfElseNode;
