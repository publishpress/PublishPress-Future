import { SelectControl } from '@wordpress/components';

export const OperatorSelector = ({ label, value, options, handleOnChange }) => {
    return <SelectControl
        label={label}
        value={value}
        options={options}
        onChange={handleOnChange}
        className="conditional-editor-modal-operator-selector"
    />;
};
