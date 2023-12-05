export const ToggleArrowButton = function (props) {
    const { Button } = wp.components;

    const onClick = function () {
        if (props.onClick) {
            props.onClick();
        }
    };

    const iconExpanded = props.iconExpanded ? props.iconExpanded : 'arrow-up-alt2';
    const iconCollapsed = props.iconCollapsed ? props.iconCollapsed : 'arrow-down-alt2';

    const icon = props.isExpanded ? iconExpanded : iconCollapsed;

    return (
        <Button
            isSmall
            icon={icon}
            onClick={onClick}
            className={props.className}
        />
    )
}
