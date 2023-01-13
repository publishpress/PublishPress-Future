/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import {Fragment} from "react";

const TextField = function (props) {
    return (
        <Fragment>
            <input type="text" name={props.name} id={props.name} className={props.className} defaultValue={props.selected} />

            <p className="description">{props.description}</p>
        </Fragment>
    )
}

export default TextField;
