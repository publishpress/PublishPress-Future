import { useEffect } from '@wordpress/element';
import {
    CUSTOM_EVENT_AUTO_LAYOUT,
    AUTO_LAYOUT_DEFAULT_DIRECTION
} from './constants';

export const AutoLayout = ({onLayout}) => {
    useEffect(() => {
        const handleAutoLayout = (event) => {
            const direction = event.detail?.direction || AUTO_LAYOUT_DEFAULT_DIRECTION;

            onLayout({ direction: direction });
        };

        document.addEventListener(CUSTOM_EVENT_AUTO_LAYOUT, handleAutoLayout);

        return () => {
            document.removeEventListener(CUSTOM_EVENT_AUTO_LAYOUT, handleAutoLayout);
        };
    }, [onLayout]);

    return null;
}

export default AutoLayout;
