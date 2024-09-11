import NodeIcon from '../node-icon';
import { PanelRow } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import PersistentPanelBody from '../persistent-panel-body';

export function NodeValidationPanel({ errors = {} }) {
    const iconSize = 18;

    const nodeErrors = Object.values(errors);

    const hasNotifications = nodeErrors.length > 0;

    return (
        <PersistentPanelBody title={__('Validation', 'post-expirator')} className="workflow-editor-validation-panel">
            {hasNotifications && (
                <>
                    {nodeErrors.map((error, index) => {
                        return (
                            <PanelRow key={`${error.error}-${index}`} className="workflow-editor-validation-notification workflow-editor-error">
                                <NodeIcon icon={'error'} size={iconSize} />
                                {error.message}
                            </PanelRow>
                        );
                    })}
                </>
            )}

            {!hasNotifications && (
                <PanelRow className="workflow-editor-validation-notification workflow-editor-success">
                    <NodeIcon icon={'yes-alt'} size={iconSize} />
                    {__('All checks have passed for this step.', 'post-expirator')}
                </PanelRow>
            )}
        </PersistentPanelBody>
    );
}

export default NodeValidationPanel;
