import { ListInput } from "./list-input";
import { filterVariablesTreeByDataType } from "../../utils";

export function PostInput({ name, label, defaultValue, onChange, variables}) {
    variables = filterVariablesTreeByDataType(variables, ['post', 'array:integer']);

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

export default PostInput;
