import { SelectControl } from '@wordpress/components';

export const CombinatorSelector = ({ label, value, options, handleOnChange }) => {
    return <SelectControl
        label={label}
        value={value}
        options={options}
        onChange={handleOnChange}
    />;
};
