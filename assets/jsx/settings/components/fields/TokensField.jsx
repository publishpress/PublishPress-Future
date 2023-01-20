/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import {Fragment} from "react";
import Select from  'react-select';

const TokensField = (props) => {
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
    }

    return (
        <Fragment>
            {props.label &&
                <label className="publishpress-future-token-label">{props.label}</label>
            }

            <Select
                options={props.options}
                isMulti={true}
                value={props.value}
                isLoading={props.isLoading}
                delimiter=","
                name={props.name}
                onChange={onChange}
                className="publishpres-future-token-field"
            />

            {description}
        </Fragment>
    )
}

export default TokensField;
