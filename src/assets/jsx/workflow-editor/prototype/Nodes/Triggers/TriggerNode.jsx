import {Handle, Position} from 'reactflow';
import CustomNode from "../../CustomNode";
import {v4 as uuidv4} from 'uuid';


function TriggerNode(props) {
    if (! props.data.color) {
        props.data.color = 'green-darken-2';
    }

    const handlers = props.handlers ? props.handlers : [
        <Handle type="source" position={Position.Right} className="" key={uuidv4()} isConnectable={true}/>
    ];

    return (
        <CustomNode
            {...props}
            isTrigger={true}
            handlers={handlers}
        />
    );
}

export default TriggerNode;
