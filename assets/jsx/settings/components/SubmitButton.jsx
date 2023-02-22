/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

const SubmitButton = function (props) {
    return (
        <input
            type="submit"
            name={props.name}
            value={props.text}
            className="button-primary"
        />
    )
}

export default SubmitButton;
