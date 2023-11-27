/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

const SettingsFieldset = function (props) {
    return (
        <fieldset>
                <legend>{props.legend}</legend>
                {props.children}
        </fieldset>
    )
}

export default SettingsFieldset;
