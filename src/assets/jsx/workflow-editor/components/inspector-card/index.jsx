import { useSelect } from "@wordpress/data";
import { store as editorStore } from "../editor-store";
import { FEATURE_DEVELOPER_MODE } from "../../constants";

export const InspectorCard = ({ title, description, icon, id }) => {
    const { isDeveloperModeEnabled } = useSelect((select) => {
        return {
            isDeveloperModeEnabled: select(editorStore).isFeatureActive(
                FEATURE_DEVELOPER_MODE,
            ),
        };
    });

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
                {isDeveloperModeEnabled && id && (
                    <>
                        <br />
                        <div>
                            ID: <code>{id}</code>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default InspectorCard;
