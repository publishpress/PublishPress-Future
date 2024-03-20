import Trigger from "./TriggerNode";

const {useState} = wp.element;

function HookActionNode(props) {
    return (
        <Trigger
            {...props}
        >
            <div>
                WP Action: {props.data.params.actionName}
            </div>
        </Trigger>
    );
}

export default HookActionNode;

export function HookActionMetaBox(props) {
    const [actionName, setActionName] = useState(props.selection.data.params.actionName);

    function onChange (event) {
        const value = event.target.value;

        setActionName(value);
        props.selection.data.params.actionName = value;
    }


    return (
        <div>
            <div>{props.selection.id}!</div>
            <label>
                WP Action:
                <input type="text" name="hookName" onChange={onChange} value={props.selection.data.params.actionName}/>
            </label>
        </div>
    )
}

export function useHookActionMetaBox(selection) {
    return <HookActionMetaBox selection={selection}></HookActionMetaBox>
}
