/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import {Fragment} from "react";
import SelectField from "./SelectField";

const TaxonomiesField = function (props) {
    const taxonomiesOptions = [];

    props.taxonomies.forEach((el) => {
        taxonomiesOptions.push(<option value={el.value}>{el.label}</option>);
    });

    return (
        <Fragment>
            <SelectField
                name={props.name}
                className={props.className}
                options={taxonomiesOptions}
            />
        </Fragment>
    )
}

export default TaxonomiesField;
