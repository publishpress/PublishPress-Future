import { ListInput } from "./list-input";

export function List({ name, label, defaultValue, onChange, settings }) {
    let options = settings['options'];

    if (!options) {
        console.log('No options found for list', name);
        return null;
    }

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
