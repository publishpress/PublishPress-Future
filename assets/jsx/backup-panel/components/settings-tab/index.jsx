export const SettingsTab = ({
    title,
    description,
    children,
}) => {
    return (
        <div className="pe-settings-tab">
            <h2>{title}</h2>

            <p>{description}</p>

            {children}
        </div>
    );
};

export default SettingsTab;
