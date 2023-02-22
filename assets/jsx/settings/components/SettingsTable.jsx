/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

const SettingsTable = function (props) {
    return (
        <table className="form-table">
            <tbody>
                {props.bodyChildren}
            </tbody>
        </table>
    )
}

export default SettingsTable;
