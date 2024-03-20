import StepNode from "./StepNode";
import {Handle, Position} from "reactflow";


function ConditionalNode(props) {
    const uuid = `${props.id}_h_`

    const handlers = props.handlers ? props.handlers : [
        <Handle type="target" position={Position.Left} className="" key={uuid + 'input'} id={uuid + 'input'}
                isConnectable={true}/>,
        <Handle type="source" position={Position.Right} className="" key={uuid + 'output_true'}
                id={uuid + 'output_true'} style={{top: '25%'}} isConnectable={true}>
            <div className="handle-description">true</div>
        </Handle>,
        <Handle type="source" position={Position.Right} className="" key={uuid + 'output_false'}
                id={uuid + 'output_false'} style={{top: '75%'}} isConnectable={true}>
            <div className="handle-description">false</div>
        </Handle>
    ];

    return (
        <StepNode
            {...props}
            handlers={handlers}
        />
    );
}

export default ConditionalNode;
