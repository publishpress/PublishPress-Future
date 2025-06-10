import { SelectControl } from "@wordpress/components";

export function Select({ name, label, defaultValue, onChange, settings }) {
    let options = settings['options'];

    if (!options) {
        console.log('No options found for list', name);
        return null;
    }

    console.log(defaultValue);

    return (
        <SelectControl
            label={label}
            options={options}
            value={defaultValue}
            onChange={(value) => onChange(name, value)}
        />
    );
}

export default Select;
