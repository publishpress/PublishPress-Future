export const compact = (array) => {
    if (!array) {
        return [];
    }

    if (! Array.isArray(array) && typeof array === 'object') {
        array = Object.values(array);
    }

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

export const getElementByName = (name) => {
    return document.getElementsByName(name)[0];
}

export const getFieldByName = (name, postId) => {
    return document.querySelector(`#the-list tr#post-${postId} .column-expirationdate input#future_action_${name}-${postId}`);
}

export const getFieldValueByName = (name, postId) => {
    const field = getFieldByName(name, postId);

    if (!field) {
        return null;
    }

    return field.value;
};

export const getFieldValueByNameAsArrayOfInt = (name, postId) => {
    const field = getFieldByName(name, postId);

    if (!field || !field.value) {
        return [];
    }

    if (typeof field.value === 'number') {
        field.value = field.value.toString();
    }

    return field.value.split(',').map(term => parseInt(term));
};

export const getFieldValueByNameAsBool = (name, postId) => {
    const field = getFieldByName(name, postId);

    if (!field) {
        return false;
    }

    return field.value === '1' || field.value === 'true';
}
