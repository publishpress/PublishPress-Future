import { ListInput } from "./list-input";
import { filterVariableOptionsByDataType } from "../../utils";

export function List({ name, label, defaultValue, onChange, settingsSchema }) {
    console.log(settingsSchema);
    let options = settingsSchema[0]['fields'][2]['options'];

    options = options.map((option) => {
        return {
            id: option.value,
            name: option.label,
            children: [],
        };
    });

    const tree = [
        ...options,
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

export default List;
