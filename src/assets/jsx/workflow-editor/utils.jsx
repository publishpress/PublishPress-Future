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

export const classnames = (...args) => args.filter(Boolean).join(' ');

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
        'blocks.getBlockMenuDefaultClassName',
        className,
        blockName
    );
}
