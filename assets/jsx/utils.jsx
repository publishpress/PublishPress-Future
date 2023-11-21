export const compact = (array) => {
    return array.filter((item) => {
        return item !== null && item !== undefined && item !== '';
    });
}

export const debugLogFactory = (config) => {
    return (description, ...message) => {
        if (console && config.isDebugEnabled) {
            console.debug('[Future]', description, ...message);
        }
    }
}

export const isGutenbergEnabled = () => {
    return document.body.classList.contains('block-editor-page');
}
