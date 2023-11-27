/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */
const NonceField = function (props) {
    const { Fragment } = wp.element;

    if (! props.name) {
        props.name = '_wpnonce';
    }

    if (! props.referrer) {
        props.referrer = true;
    }

    return (
        <Fragment>
            <input type="hidden" name={props.name} id={props.name} value={props.nonce} />

            {props.referrer &&
                <input type="hidden" name="_wp_http_referer" value={props.referrer}/>
            }
        </Fragment>
    )
}

export default NonceField;
