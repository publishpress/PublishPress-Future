import Trigger from "./TriggerNode";

const {useState} = wp.element;

function HookFilterNode(props) {
    return (
        <Trigger
            {...props}
        >
            <div>
                WP Filter: {props.data.params.filterName}
            </div>
        </Trigger>
    );
}

export default HookFilterNode;

export function HookFilterMetaBox(props) {
    const [filterName, setFilterName] = useState(props.selection.data.params.filterName);

    function onChange (event) {
        const value = event.target.value;

        setFilterName(value);
        props.selection.data.params.filterName = value;
    }


    return (
        <div>
            <div>{props.selection.id}!</div>
            <label>
                WP Filter:
                <input type="text" name="hookName" onChange={onChange} value={props.selection.data.params.filterName}/>
            </label>
        </div>
    )
}

export function useHookFilterMetaBox(selection) {
    return <HookFilterMetaBox selection={selection}></HookFilterMetaBox>
}
