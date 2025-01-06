import { useSelect } from "@wordpress/data";
import { store as editorStore } from "../editor-store";
import {
    FEATURE_DEVELOPER_MODE,
    FEATURE_ADVANCED_SETTINGS,
} from "../../constants";
import { __ } from "@wordpress/i18n";
export const InspectorCard = ({ title, description, icon, id, slug, isProFeature }) => {
    const {
        isDeveloperModeEnabled,
        isAdvancedSettingsEnabled,
        isPro
    } = useSelect((select) => {
        return {
            isDeveloperModeEnabled: select(editorStore).isFeatureActive(FEATURE_DEVELOPER_MODE),
            isAdvancedSettingsEnabled: select(editorStore).isFeatureActive(FEATURE_ADVANCED_SETTINGS),
            isPro: select(editorStore).isPro(),
        };
    });

    const nodeAttributes = [];
    if (isDeveloperModeEnabled) {
        nodeAttributes.push({
            id: "id",
            label: "ID",
            value: id,
        });
    }

    if (isAdvancedSettingsEnabled) {
        nodeAttributes.push({
            id: "slug",
            label: "Slug",
            value: slug,
        });
    }

    return (
        <div className="workflow-editor-inspector-card">
            <span className="workflow-editor-inspector-icon has-colors">
                {icon}
            </span>
            <div className="workflow-editor-inspector-card__content">
                <h2 className="workflow-editor-inspector-card__title">
                    {title}
                    {isProFeature && !isPro && (
                        <span className="workflow-editor-inspector-card__pro-badge">
                            {__("Pro", "post-expirator")}
                        </span>
                    )}
                </h2>
                <div className="workflow-editor-inspector-card__description">
                    {description}
                </div>

                {isProFeature && !isPro && (
                    <div className="workflow-editor-inspector-card__pro-instructions">
                        <a href="https://publishpress.com/links/future-workflow-inspector" target="_blank">
                        {__("Currently this step is being skipped. Upgrade to Pro to unlock this feature.", "post-expirator")}
                        </a>
                    </div>
                )}

                {nodeAttributes.length > 0 && (
                    <>
                        <table>
                            <tbody>
                                {nodeAttributes.map((attribute) => {
                                    return (
                                        <tr key={"attribute_" + attribute.id}>
                                            <th>{attribute.label}</th>
                                            <td>{attribute.value}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
};

export default InspectorCard;
