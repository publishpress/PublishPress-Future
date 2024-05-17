import { Handle, Position } from 'reactflow';
import { memo } from '@wordpress/element';
import { Icon } from '@wordpress/components';
import { RxTarget } from "react-icons/rx";
import { NodeIcon } from '../node-icon';

export const TriggerNode = memo(({ data, isConnectable }) => {
    const nodeClassName = data?.className || 'react-flow__node-triggerNode';

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
            <span className="react-flow__trigger_tag">
                <Icon icon={RxTarget} size={10} />Trigger
            </span>
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

export default TriggerNode;
