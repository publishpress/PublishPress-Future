/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

const SettingsForm = function (props) {
    return (
        <form method="post">
            {props.children}
        </form>
    )
}

export default SettingsForm;
