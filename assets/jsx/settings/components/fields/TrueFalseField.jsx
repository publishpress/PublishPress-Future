/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import {Fragment} from "react";

const TrueFalseField = function (props) {
    return (
        <Fragment>
            <input
                type="radio"
                name={props.fieldName}
                id={props.fieldName + '-true'}
                value={props.trueValue}
                defaultChecked={props.selected}/>

            <label htmlFor={props.fieldName + '-true'}>{props.trueLabel}</label>
            &nbsp;&nbsp;
            <input
                type="radio"
                name={props.fieldName}
                defaultChecked={!props.selected}
                id={props.fieldName + '-false'}
                value={props.falseValue}/>
            <label
                htmlFor={props.fieldName + '-false'}>{props.falseLabel}</label>

            <p className="description">{props.description}</p>
        </Fragment>
    )
}

export default TrueFalseField;
