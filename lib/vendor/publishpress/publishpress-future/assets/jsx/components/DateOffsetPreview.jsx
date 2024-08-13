import {
    useState,
    useEffect,
    useRef,
    Fragment
} from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { apiFetch } from '&wp';

export const DateOffsetPreview = ({
    offset,
    label,
    labelDatePreview,
    labelOffsetPreview,
    setValidationErrorCallback,
    setHasPendingValidationCallback,
    setHasValidDataCallback,
}) => {
    const [offsetPreview, setOffsetPreview] = useState('');
    const [currentTime, setCurrentTime] = useState();

    const apiRequestControllerRef = useRef(new AbortController());

    const validateDateOffset = () => {
        if (offset) {
            const controller = apiRequestControllerRef.current;

            if (controller) {
                controller.abort();
            }

            apiRequestControllerRef.current = new AbortController();
            const { signal } = apiRequestControllerRef.current;

            setHasPendingValidationCallback(true);

            apiFetch({
                path: addQueryArgs(`publishpress-future/v1/settings/validate-expire-offset`),
                method: 'POST',
                data: {
                    offset
                },
                signal,
            }).then((result) => {
                setHasPendingValidationCallback(false);

                setHasValidDataCallback(result.isValid);
                setValidationErrorCallback(result.message);

                if (result.isValid) {
                    setOffsetPreview(result.preview);
                    setCurrentTime(result.currentTime);
                } else {
                    setOffsetPreview('');
                }
            }).catch((error) => {
                if (error.name === 'AbortError') {
                    return;
                }

                setHasPendingValidationCallback(false);
                setHasValidDataCallback(false);
                setValidationErrorCallback(error.message);
                setOffsetPreview('');
            });
        }
    }

    useEffect(() => {
        validateDateOffset();
    }, [offset]);

    return (
        <Fragment>
            { offset && (
                <Fragment>
                    <h4>{ label }</h4>
                    <div>
                        <div>
                            <span>{ labelDatePreview }: </span>
                            <span><code>{currentTime}</code></span>
                        </div>
                        <div>
                            <span>{ labelOffsetPreview }: </span>
                            <span><code>{offsetPreview}</code></span>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default DateOffsetPreview;
