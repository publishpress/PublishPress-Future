/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */
import { Fragment } from "&wp.element";

export const NonceControl = function (props) {
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
