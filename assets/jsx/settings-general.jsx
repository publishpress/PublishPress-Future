/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

import { DateOffsetPreview } from "./components";

import {
    StrictMode,
    createRoot,
    useState,
    useEffect
} from "@wordpress/element";

import {
    text,
} from "&config.settings-general";

const SettingsFormPanel = (props) => {
    const [isValidForm, setIsValidForm] = useState(true);
    const [validationError, setValidationError] = useState('');
    const [hasPendingValidation, setHasPendingValidation] = useState(false);
    const [offset, setOffset] = useState('');

    const onHasValidationError = (errorMessage) => {
        if (errorMessage) {
            setIsValidForm(false);
            setValidationError(errorMessage);
        } else {
            setIsValidForm(true);
            setValidationError('');
        }
    }

    const onValidationStarted = (inProgress) => {
        setHasPendingValidation(inProgress);
    }

    const onValidationFinished = (isValid) => {
        setHasPendingValidation(false);
        setIsValidForm(isValid);
    }

    useEffect(() => {
        jQuery('#expired-custom-expiration-date').on('keyup', function () {
            setOffset(jQuery(this).val());
        });

        setOffset(jQuery('#expired-custom-expiration-date').val());
    }, []);

    return (
        <StrictMode>
            <DateOffsetPreview
                offset={offset}
                label={text.datePreview}
                labelDatePreview={text.datePreviewCurrent}
                labelOffsetPreview={text.datePreviewComputed}
                setValidationErrorCallback={onHasValidationError}
                setHasPendingValidationCallback={onValidationStarted}
                setHasValidDataCallback={onValidationFinished}
                />

            {! isValidForm && validationError && (
                <div className="publishpress-future-notice publishpress-future-notice-error">
                    <p>{text.error}: {validationError}</p>
                </div>
            )}
        </StrictMode>
    )
};

const container = document.getElementById("expiration-date-preview");
const component = (<SettingsFormPanel />);

createRoot(container).render(component);
