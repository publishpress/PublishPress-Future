/*
 * Copyright (c) 2025, Ramble Ventures
 */
import { Fragment, useState, useEffect } from "@wordpress/element";
import { FormTokenField } from "@wordpress/components";

export const TokensControl = (props) => {
    const [stringValue, setStringValue] = useState('');

    useEffect(() => {
        if (props.value) {
            setStringValue(props.value.join(','));
        }
    }, [props.value]);

    let description;

    if (props.description) {
        if (props.unescapedDescription) {
            // If using this option, the HTML has to be escaped before injected into the JS interface.
            description = <p className="description" dangerouslySetInnerHTML={{__html: props.description}}></p>;
        } else {
            description = <p className="description">{props.description}</p>;
        }
    }

    const onChange = (value) => {
        if (props.onChange) {
            props.onChange(value);
        }

        if (typeof value === 'object') {
            setStringValue(value.join(','));
        } else {
            setStringValue('');
        }
    }

    const value = props.value ? props.value : [];
 
    return (
        <Fragment>
            <FormTokenField
                label={props.label}
                value={value}
                suggestions={props.options}
                onChange={onChange}
                maxSuggestions={props.maxSuggestions}
                className="publishpres-future-token-field"
                __experimentalExpandOnFocus={props.expandOnFocus}
                __experimentalAutoSelectFirstMatch={props.autoSelectFirstMatch}
            />
            <input type="hidden" name={props.name} value={stringValue} />

            {description}
        </Fragment>
    )
}
