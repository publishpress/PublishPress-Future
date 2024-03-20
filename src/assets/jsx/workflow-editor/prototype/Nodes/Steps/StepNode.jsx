import {Handle, Position} from 'reactflow';
import CustomNode from "../../CustomNode";
import {v4 as uuidv4} from 'uuid';

function StepNode(props) {
    if (! props.data.color) {
        props.data.color = 'blue-lighten-5';
    }

    const handlers = props.handlers ? props.handlers : [
        <Handle type="target" position={Position.Left} className="" key={uuidv4()} isConnectable={true}/>,
        <Handle type="source" position={Position.Right} className="" key={uuidv4()} isConnectable={true}/>
    ];

    return (
        <CustomNode
            {...props}
            isTrigger={false}
            handlers={handlers}
        />
    );
}

export default StepNode;
