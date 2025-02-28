import { ListInput } from "./list-input";
import { filterVariablesTreeByDataType } from "../../utils";

export function ManualWorkflowInput({ name, label, defaultValue, onChange, variables}) {
    variables = filterVariablesTreeByDataType(variables, ['workflow', 'array:integer']);

    const tree = [
        {
            id: "",
            name: "",
            "children": [],
        },
        ...variables,
    ];

    return (
        <ListInput
            tree={tree}
            name={name}
            label={label}
            defaultValue={defaultValue}
            onChange={onChange}
        />
    );
}

export default ManualWorkflowInput;
