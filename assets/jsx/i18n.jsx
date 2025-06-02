import {
    __ as wp__,
    sprintf as wpSprintf,
    isRTL as wpIsRTL,
    _n as wpN,
    _x as wpX,
    _nx as wpNx,
    _n_noop as wpNNoop,
    _nx_noop as wpNxNoop,
} from '@wordpress/i18n';

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

export const sprintf = (text, ...args) => {
    return wpSprintf(text, ...args);
};

export const isRTL = () => {
    return wpIsRTL();
};

export const _n = (single, plural, number, domain) => {
    single = __(single, domain);
    plural = __(plural, domain);

    return wpN(single, plural, number, domain);
};

export const _x = (text, context, domain) => {
    text = __(text, domain);

    return wpX(text, context, domain);
};

export const _nx = (single, plural, number, context, domain) => {
    single = __(single, domain);
    plural = __(plural, domain);

    return wpNx(single, plural, number, context, domain);
};

export const _n_noop = (single, plural, domain) => {
    single = __(single, domain);
    plural = __(plural, domain);

    return wpNNoop(single, plural, domain);
};

export const _nx_noop = (single, plural, context, domain) => {
    single = __(single, domain);
    plural = __(plural, domain);

    return wpNxNoop(single, plural, context, domain);
};

if (typeof window.publishpress === 'undefined') {
    window.publishpress = {};
}

if (typeof window.publishpress.i18n === 'undefined') {
    window.publishpress.i18n = {};
}

window.publishpress.i18n.__ = __;
window.publishpress.i18n.sprintf = sprintf;
window.publishpress.i18n.isRTL = isRTL;
window.publishpress.i18n._n = _n;
window.publishpress.i18n._x = _x;
window.publishpress.i18n._nx = _nx;
window.publishpress.i18n._n_noop = _n_noop;
window.publishpress.i18n._nx_noop = _nx_noop;

