import NodeIcon from '../node-icon';
import { PanelRow } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import PersistentPanelBody from '../persistent-panel-body';

export function NodeValidationPanel({ errors }) {
    const nodeErrors = Object.values(errors);

    return (
        <PersistentPanelBody title={__('Validation', 'publishpress-future-pro')} className="workflow-editor-validation-panel">
                {nodeErrors.map((error, index) => {
                    return (
                        <PanelRow key={index} className="workflow-editor-error">
                            <div>
                                <NodeIcon icon={'warning'} size={16} /> {error.message}
                            </div>
                        </PanelRow>
                    );
                })}
        </PersistentPanelBody>
    );
}

export default NodeValidationPanel;
