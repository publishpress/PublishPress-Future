export const BaseField = ({ children, description }) => {
    return (
        <>
            {description && <div className="settings-field-description">{description}</div>}

            {children}
        </>
    );
}

export default BaseField;
