/*
 * Copyright (c) 2025, Ramble Ventures
 */

export const SubmitButton = function (props) {
    return (
        <input
            type="submit"
            name={props.name}
            value={props.text}
            disabled={props.disabled}
            className="button-primary"
        />
    )
}
