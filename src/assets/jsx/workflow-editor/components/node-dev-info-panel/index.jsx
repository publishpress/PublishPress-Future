import { PanelRow } from "@wordpress/components";
import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import ReactJson from "react-json-view";

export function NodeDevInfoPanel({node}) {
    return (
        <PanelBody title={__('Developer Info')} icon={'admin-tools'} className="workflow-editor-dev-info-panel workflow-editor-dev-panel">
            <PanelRow>
                <div className="workflow-editor-dev-info-wrapper">
                    <ReactJson src={node} collapsed={1} collapseStringsAfterLength={50} displayDataTypes={false} displayObjectSize={false} enableClipboard={false} />
                </div>
            </PanelRow>
        </PanelBody>
    );
}

export default NodeDevInfoPanel;
