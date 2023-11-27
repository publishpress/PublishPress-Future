/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import TrueFalseField from "./fields/TrueFalseField";

const SettingRow = function (props) {
    const { Fragment } = wp.element;

    return (
        <tr valign="top">
            <th scope="row">
                <label htmlFor="">{props.label}</label>
            </th>
            <td>
                {props.children}
            </td>
        </tr>
    )
}

export default SettingRow;
