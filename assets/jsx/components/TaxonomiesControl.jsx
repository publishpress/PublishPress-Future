/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import { SelectControl } from ".";

export const TaxonomiesControl = function (props) {
    const { Fragment } = wp.element;

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
