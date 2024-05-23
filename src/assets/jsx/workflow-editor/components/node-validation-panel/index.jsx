import { Icon } from "@wordpress/components";
import { PanelBody, PanelRow } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export function NodeValidationPanel({ errors }) {
    const nodeErrors = Object.values(errors);

    return (
        <PanelBody title={__('Validation')} icon={'warning'} className="workflow-editor-validation-panel">
                {nodeErrors.map((error, index) => {
                    return (
                        <PanelRow key={index} className="workflow-editor-error">
                            <div>
                                <Icon icon={'warning'} /> {error.message}
                            </div>
                        </PanelRow>
                    );
                })}
        </PanelBody>
    );
}

export default NodeValidationPanel;
