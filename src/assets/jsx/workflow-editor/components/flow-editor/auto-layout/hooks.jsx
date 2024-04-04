import {CUSTOM_EVENT_AUTO_LAYOUT} from './constants';

const autoLayout = ({direction}) => {
    const customEvent = new CustomEvent(CUSTOM_EVENT_AUTO_LAYOUT, {
        detail: {
            direction: direction,
        },
    });

    document.dispatchEvent(customEvent);
};

export const useAutoLayout = () => autoLayout;
