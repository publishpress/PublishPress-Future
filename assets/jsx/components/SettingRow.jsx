/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */
import { Fragment } from "&wp.element";

export const SettingRow = function (props) {
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
