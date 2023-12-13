/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

export const SettingsTable = function (props) {
    return (
        <table className="form-table">
            <tbody>
                {props.bodyChildren}
            </tbody>
        </table>
    )
}
