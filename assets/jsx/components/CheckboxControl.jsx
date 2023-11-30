/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

export const CheckboxControl = function (props) {
    const { Fragment, useState } = wp.element;
    const WPCheckboxControl = wp.components.CheckboxControl;

    const [checked, setChecked] = useState(props.checked || false);

    let description;

    if (props.unescapedDescription) {
        // If using this option, the HTML has to be escaped before injected into the JS interface.
        description = <p className="description" dangerouslySetInnerHTML={{ __html: props.description }}></p>;
    } else {
        description = <p className="description">{props.description}</p>;
    }

    const onChange = function (value) {
        setChecked(value);

        if (props.onChange) {
            props.onChange(value);
        }
    };

    return (
        <Fragment>
            <WPCheckboxControl
                label={props.label}
                name={props.name}
                id={props.name}
                className={props.className}
                checked={checked || false}
                onChange={onChange}
            />

            {description}
        </Fragment>
    )
}
