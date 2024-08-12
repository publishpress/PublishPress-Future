/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

export const SettingsFieldset = function (props) {
    return (
        <fieldset className={props.className}>
                <legend>{props.legend}</legend>
                {props.children}
        </fieldset>
    )
}
