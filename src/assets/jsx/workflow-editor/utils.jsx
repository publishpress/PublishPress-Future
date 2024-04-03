import { applyFilters } from '@wordpress/hooks';

export function addBodyClass(className) {
    if (document.body.classList.contains(className)) return;

    document.body.classList.add(className);
};

export function removeBodyClass(className) {
    if (!document.body.classList.contains(className)) return;

    document.body.classList.remove(className);
}

export function addBodyClasses(classNames) {
    classNames.forEach(className => addBodyClass(className));
}

export function removeBodyClasses(classNames) {
    classNames.forEach(className => removeBodyClass(className));
}

/**
 * Returns the block's default menu item classname from its name.
 *
 * @param {string} blockName The block name.
 *
 * @return {string} The block's default menu item class.
 */
export function getNodeMenuDefaultClassName(blockName) {
    // Generated HTML classes for blocks follow the `editor-block-list-item-{name}` nomenclature.
    // Blocks provided by WordPress drop the prefixes 'core/' or 'core-' (historically used in 'core-embed/').
    const className =
        'editor-block-list-item-' +
        blockName.replace(/\//, '-').replace(/^core-/, '');

    return applyFilters(
        'future-pro.getNodeMenuDefaultClassName',
        className,
        blockName
    );
}

/**
 * Return true if platform is MacOS.
 *
 * @param {Object} _window window object by default; used for DI testing.
 *
 * @return {boolean} True if MacOS; false otherwise.
 */
export function isAppleOS(_window = window) {
    const { platform } = _window.navigator;

    return (
        platform.indexOf('Mac') !== -1 ||
        ['iPad', 'iPhone'].includes(platform)
    );
}
