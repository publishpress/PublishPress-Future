/*
 * Copyright (c) 2025, Ramble Ventures
 */
import { Fragment } from "@wordpress/element";

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
