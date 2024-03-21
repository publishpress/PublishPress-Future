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
