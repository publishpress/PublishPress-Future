import { Handle, Position } from 'reactflow';
import { memo } from '@wordpress/element';

export const GenericNode = memo(({ data, isConnectable }) => {
    const nodeClassName = data?.className || 'react-flow__node-genericNode';

    let targetHandles = null;
    if (data.socketSchema) {
        if (data.socketSchema.target) {
            targetHandles = data.socketSchema.target.map((handle) => {
                return (
                    <Handle
                        key={handle.id}
                        type="target"
                        position={Position.Top}
                        id={handle.id}
                        style={{ left: handle.left}}
                        isConnectable={isConnectable}
                    />
                );
            });
        }
    }

    let sourceHandles = null;
    if (data.socketSchema) {
        if (data.socketSchema.source) {
            sourceHandles = data.socketSchema.source.map((handle) => {
                return (
                    <Handle
                        key={handle.id}
                        type="source"
                        position={Position.Bottom}
                        id={handle.id}
                        style={{ left: handle.left }}
                        isConnectable={isConnectable}
                    />
                );
            });
        }
    }

    return (
        <div className={"react-flow__node-body " + nodeClassName}>
            {targetHandles}

            <div className='react-flow__node-label'>
                {data.label}
            </div>

            {sourceHandles}
        </div>
    );
});

export default GenericNode;
