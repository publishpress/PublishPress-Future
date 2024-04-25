import { __ } from '@wordpress/i18n';

export const InspectorCard = ({ title, description, icon, id }) => {
    return (
        <div className="workflow-editor-inspector-card">
            <span className="workflow-editor-inspector-icon has-colors">
                {icon}
            </span>
            <div className="workflow-editor-inspector-card__content">
                <h2 className="workflow-editor-inspector-card__title">
                    {title}
                </h2>
                <div className="workflow-editor-inspector-card__description">
                    {description}
                </div>
                {id && (
                    <>
                        <br />
                        <div>ID: <code>{id}</code></div>
                    </>
                )}
            </div>
        </div>
    );
};

export default InspectorCard;
