/*
 * Copyright (c) 2024, Ramble Ventures
 */
import { Fragment } from "@wordpress/element";
import { SelectControl as WPSelectControl } from "@wordpress/components";

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
