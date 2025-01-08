/*
 * Copyright (c) 2025, Ramble Ventures
 */
import { Fragment } from "@wordpress/element";
import { TextControl as WPTextControl } from "@wordpress/components";
import { Spinner } from "./";

export const TextControl = function (props) {
    let description;

    if (props.unescapedDescription) {
        // If using this option, the HTML has to be escaped before injected into the JS interface.
        description = <p className="description" dangerouslySetInnerHTML={{ __html: props.description }}></p>;
    } else {
        description = <p className="description">{props.description}</p>;
    }

    const onChange = function (value) {
        if (props.onChange) {
            props.onChange(value);
        }
    };

    let className = props.className ? props.className : '';

    if (props.loading) {
        className += ' publishpress-future-loading publishpress-future-loading-input';
    }

    return (
        <Fragment>
            <div className={className}>
                <WPTextControl
                    type="text"
                    label={props.label}
                    name={props.name}
                    id={props.name}
                    className={props.className}
                    value={props.value}
                    placeholder={props.placeholder}
                    onChange={onChange}
                />

                {props.loading && <Spinner/>}

                {description}
            </div>
        </Fragment>
    )
}
