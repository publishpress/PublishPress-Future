import { Handle, Position } from 'reactflow';
import { memo } from '@wordpress/element';
import NodeIcon from '../node-icon';

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
        <>
            <div className={"react-flow__node-body " + nodeClassName}>
                {targetHandles}

                <div className='react-flow__node-inner-body'>
                    <div className='react-flow__node-label'>
                        <NodeIcon icon={data.icon} size={14} />
                        <span>{data.label}</span>
                    </div>
                </div>

                <div className='react-flow__node-socket-area'>
                    <div className="react-flow__node-socket-name">Next</div>
                </div>

                {sourceHandles}
            </div>
        </>
    );
});

export default GenericNode;
