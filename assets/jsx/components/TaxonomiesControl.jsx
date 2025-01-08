/*
 * Copyright (c) 2025, Ramble Ventures
 */

import { SelectControl } from ".";
import { Fragment } from "@wordpress/element";

export const TaxonomiesControl = function (props) {
    const taxonomiesOptions = [];

    props.taxonomies.forEach((el) => {
        taxonomiesOptions.push(<option value={el.value}>{el.label}</option>);
    });

    return (
        <Fragment>
            <SelectControl
                name={props.name}
                className={props.className}
                options={taxonomiesOptions}
            />
        </Fragment>
    )
}
