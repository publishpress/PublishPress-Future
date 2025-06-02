import { __ as wp__ } from '@wordpress/i18n';

export const __ = (text, domain) => {
    const data = window.publishpressI18nConfig.data;
    const dataDomain = data?.domain || null;

    if (dataDomain === null) {
        return wp__(text, domain);
    }

    const localeData = data?.locale_data?.[dataDomain] || null;

    if (localeData === null) {
        return wp__(text, domain);
    }

    if (localeData?.[text]) {
        return localeData[text][0];
    }

    return wp__(text, domain);
};

if (typeof window.publishpress === 'undefined') {
    window.publishpress = {};
}

if (typeof window.publishpress.i18n === 'undefined') {
    window.publishpress.i18n = {};
}

window.publishpress.i18n.__ = __;
