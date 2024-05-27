import NodeIcon from '../node-icon';
import { PanelBody, PanelRow } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export function NodeValidationPanel({ errors }) {
    const nodeErrors = Object.values(errors);

    return (
        <PanelBody title={__('Validation', 'publishpress-future-pro')} className="workflow-editor-validation-panel">
                {nodeErrors.map((error, index) => {
                    return (
                        <PanelRow key={index} className="workflow-editor-error">
                            <div>
                                <NodeIcon icon={'warning'} size={16} /> {error.message}
                            </div>
                        </PanelRow>
                    );
                })}
        </PanelBody>
    );
}

export default NodeValidationPanel;
