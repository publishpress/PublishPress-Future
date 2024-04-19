import { Handle, Position } from "reactflow";
import { memo } from "@wordpress/element";

export const GenericActionNode = memo(({ data, isConnectable }) => {
    return (
        <>
            <Handle
                type="target"
                position={Position.Top}
                id="socket-input"
                style={{ left: "50%" }}
                isConnectable={isConnectable}
            />
            <div className="react-flow__node-label">{data.label}</div>
            <Handle
                type="source"
                position={Position.Bottom}
                id="socket-output"
                style={{ left: "50%" }}
                isConnectable={isConnectable}
            />
        </>
    );
});

export default GenericActionNode;
