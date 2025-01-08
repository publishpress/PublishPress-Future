/*
 * Copyright (c) 2025, Ramble Ventures
 */
import { Fragment } from "@wordpress/element";

export const SettingsSection = function (props) {
    return (
        <Fragment>
            <h2>{props.title}</h2>
            <p>{props.description}</p>
            {props.children}
        </Fragment>
    )
}
