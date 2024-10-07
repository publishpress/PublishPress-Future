import { useEffect } from 'react';

const $ = window.jQuery;

const useScrollToTop = (ref, parentSelector) => {
    useEffect(() => {
        if (ref.current) {
            $(ref.current).closest(parentSelector).scrollTop(0);
        }
    }, [ref, parentSelector]);
};

export default useScrollToTop;
