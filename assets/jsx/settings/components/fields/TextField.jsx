/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import {Fragment, useState, useEffect} from "react";

const TextField = function (props) {
    let description;

    if (props.unescapedDescription) {
        // If using this option, the HTML has to be escaped before injected into the JS interface.
        description = <p className="description" dangerouslySetInnerHTML={{__html: props.description}}></p>;
    } else {
        description = <p className="description">{props.description}</p>;
    }

    const [theValue, setTheValue] = useState(props.value);

    const onChange = function (e) {
        setTheValue(jQuery(e.target).val());

        if (props.onChange) {
            props.onChange();
        }
    };
    
    useEffect(() => {
        setTheValue(props.value);
    }, [props.value]);

    return (
        <Fragment>
            <input
                type="text"
                name={props.name}
                id={props.name}
                className={props.className}
                value={theValue}
                placeholder={props.placeholder}
                onChange={onChange}
            />

            {description}
        </Fragment>
    )
}

export default TextField;
