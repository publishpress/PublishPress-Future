/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import {Fragment} from "react";

const SelectField = function (props) {
    const optionsList = [];

    props.options.forEach((el) => {
        optionsList.push(<option value={el.value}>{el.label}</option>);
    });

    return (
        <Fragment>
            <select name={props.name} id={props.name} className={props.className} defaultValue={props.selected}>
                {optionsList}
            </select>

            <p className="description">{props.description}</p>
        </Fragment>
    )
}

export default SelectField;
