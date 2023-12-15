/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */
import { Fragment } from "&wp.element";
import { SelectControl as WPSelectControl } from "&wp.components";

export const SelectControl = function (props) {
    const onChange = (value) => {
        props.onChange(value);
    };

    return (
        <Fragment>
            {props.options.length === 0 && (
                <div>{props.noItemFoundMessage}</div>
            )}

            {props.options.length > 0 && (
                <WPSelectControl
                    label={props.label}
                    name={props.name}
                    id={props.name}
                    className={props.className}
                    value={props.selected}
                    onChange={onChange}
                    data-data={props.data}
                    options={props.options}
                />
            )}

            {props.children}

            <p className="description">{props.description}</p>
        </Fragment>
    )
}
