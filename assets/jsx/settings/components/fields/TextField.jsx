/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import {Fragment} from "react";

const TextField = function (props) {
    let description;

    if (props.unescapedDescription) {
        // If using this option, the HTML has to be escaped before injected into the JS interface.
        description = <p className="description" dangerouslySetInnerHTML={{__html: props.description}}></p>;
    } else {
        description = <p className="description">{props.description}</p>;
    }

    return (
        <Fragment>
            <input
                type="text"
                name={props.name}
                id={props.name}
                className={props.className}
                defaultValue={props.selected}
                placeholder={props.placeholder}
            />

            {description}
        </Fragment>
    )
}

export default TextField;
