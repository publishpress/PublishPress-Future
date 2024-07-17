import { useState, useMemo, useEffect } from '@wordpress/element';
import { FormTokenField } from '@wordpress/components';

const convertListOfLabelsToValues = (selected, suggestions) => {
    if (!selected) {
        return [];
    }

    return selected.map((selected) => {
        const suggestion = suggestions.find((suggestion) => suggestion.label === selected);

        return suggestion ? suggestion.value : selected;
    });
};

const convertListOfValuesToLabels = (selected, suggestions) => {
    if (! selected) {
        return [];
    }

    return selected.map((selected) => {
        const suggestion = suggestions.find((suggestion) => suggestion.value === selected);

        return suggestion ? suggestion.label : selected;
    });
};

export const InlineMultiSelect = ({
    label,
    expandOnFocus,
    autoSelectFirstMatch,
    onChange,
    suggestions,
    value,
    className
}) => {

    const defaultSelectedLabels = useMemo(() => {
        return convertListOfValuesToLabels(value, suggestions);
    });

    const [selectedLabels, setSelectedLabels] = useState(defaultSelectedLabels);
    const [selectedValues, setSelectedValues] = useState(value);

    const suggestionsLabels = suggestions.map((suggestion) => suggestion.label);



    useEffect(() => {
        setSelectedLabels(convertListOfValuesToLabels(value, suggestions));
        setSelectedValues(value);
    }, [value]);


    const onValueChange = (labels) => {
        setSelectedLabels(labels);

        const values = convertListOfLabelsToValues(labels, suggestions);

        setSelectedValues(values);

        if (onChange !== undefined) {
            onChange(values, labels);
        }
    }

    return (
        <FormTokenField
            label={label}
            value={selectedLabels}
            suggestions={suggestionsLabels}
            __experimentalExpandOnFocus={expandOnFocus}
            __experimentalAutoSelectFirstMatch={autoSelectFirstMatch}
            onChange={onValueChange}
            className={className}
        />
    );
}

export default InlineMultiSelect;
