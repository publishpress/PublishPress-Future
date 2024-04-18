import { Handle, Position } from "reactflow";
import { memo } from "@wordpress/element";

export const GenericTriggerNode = memo(({ data, isConnectable }) => {
    return (
        <>
            <div className="react-flow__node-label">{data.label}</div>
            <Handle
                type="source"
                position={Position.Bottom}
                id="a"
                style={{ left: "50%", background: "#555" }}
                isConnectable={isConnectable}
            />
        </>
    );
});

export default GenericTriggerNode;
