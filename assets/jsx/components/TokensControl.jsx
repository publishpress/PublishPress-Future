/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */
import { Fragment, useState, useEffect } from "&wp.element";
import { FormTokenField } from "&wp.components";

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
                maxSuggestions={10}
                className="publishpres-future-token-field"
            />
            <input type="hidden" name={props.name} value={stringValue} />

            {description}
        </Fragment>
    )
}
