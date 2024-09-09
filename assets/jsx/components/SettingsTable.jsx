/*
 * Copyright (c) 2024, Ramble Ventures
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
