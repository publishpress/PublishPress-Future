import { PanelBody, PanelRow } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export function NodeValidationPanel({ errors }) {
    const nodeErrors = Object.values(errors);

    return (
        <PanelBody title={__('Validation')} icon={'warning'}>
                {nodeErrors.map((error, index) => {
                    return (
                        <PanelRow key={index}>
                            {__('Error:', 'publishpress-future-pro')} {error.message}
                        </PanelRow>
                    );
                })}
        </PanelBody>
    );
}

export default NodeValidationPanel;
