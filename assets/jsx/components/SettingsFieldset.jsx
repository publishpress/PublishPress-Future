/*
 * Copyright (c) 2024, Ramble Ventures
 */

export const SettingsFieldset = function (props) {
    return (
        <fieldset className={props.className}>
                <legend>{props.legend}</legend>
                {props.children}
        </fieldset>
    )
}
