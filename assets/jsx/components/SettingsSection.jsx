/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

const SettingsSection = function (props) {
    const { Fragment } = wp.element;
    return (
        <Fragment>
            <h2>{props.title}</h2>
            <p>{props.description}</p>
            {props.children}
        </Fragment>
    )
}

export default SettingsSection;
