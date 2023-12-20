/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */
import { Fragment } from "&wp.element";

export const SettingsSection = function (props) {
    return (
        <Fragment>
            <h2>{props.title}</h2>
            <p>{props.description}</p>
            {props.children}
        </Fragment>
    )
}
