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
    let socketAreas = null;
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

            socketAreas = data.socketSchema.source.map((handle) => {
                return (
                    <div
                        key={handle.id + 'socketArea'}
                        className='react-flow__node-socket-name'
                    >
                        {handle.label}
                    </div>
                );
            });
        }
    }

    return (
        <>
            <div className={"react-flow__node-body " + nodeClassName}>
                {targetHandles}

                <div className='react-flow__node-inner-body'>
                    <div className="react-flow__node-slug">{data.slug}</div>
                    <div className='react-flow__node-header'>
                        <NodeIcon icon={data.icon} size={14} />
                        <div className="react-flow__node-label">{data.label}</div>
                    </div>
                </div>

                <div className='react-flow__node-socket-area'>
                    {socketAreas}
                </div>

                {sourceHandles}
            </div>
        </>
    );
});

export default GenericNode;
