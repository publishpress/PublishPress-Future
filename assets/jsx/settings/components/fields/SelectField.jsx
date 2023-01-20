/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import {Fragment} from "react";

const SelectField = function (props) {
    const optionsList = [];

    if (typeof props.options === 'object' && props.options.forEach) {
        props.options.forEach((el) => {
            optionsList.push(<option value={el.value}>{el.label}</option>);
        });
    }

    if (optionsList.length === 0) {
        return (<p>{props.noItemFoundMessage ? props.noItemFoundMessage : 'No items found'}</p>)
    }

    const onChange = (e) => {
        if (! props.onChange) {
            return;
        }

        props.onChange(jQuery(e.target).val());
    };

    return (
        <Fragment>
            <select
                name={props.name}
                id={props.name}
                className={props.className}
                defaultValue={props.selected}
                onChange={onChange}
                data-data={props.data}
            >
                {optionsList}
            </select>

            <p className="description">{props.description}</p>
        </Fragment>
    )
}

export default SelectField;
