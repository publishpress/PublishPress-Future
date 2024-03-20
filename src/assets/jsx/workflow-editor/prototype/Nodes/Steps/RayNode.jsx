import StepNode from "./StepNode";
import '../../css/ray.css';

const {useState} = wp.element;

function RayNode(props) {
    return (
        <StepNode
            {...props}
        >
            <div>
                Color: <span
                className={'pwe-ray-color ' + props.data.params.color}>&nbsp;</span> {props.data.params.color}
            </div>
        </StepNode>
    );
}

export default RayNode;

export function RayMetaBox(props) {
    const [color, setColor] = useState(props.selection.data.params.color);

    const onChange = (event) => {
        const value = event.target.value;

        setColor(value);
        props.selection.data.params.color = value;
    }

    return (
        <>
            <label>
                Color: <input type="text" name="color" onChange={onChange} value={props.selection.data.params.color}/>
            </label>
        </>
    )
}

export function useRayMetabox(selection, modalRef) {
    return <RayMetaBox selection={selection} modalRef={modalRef}/>
}
