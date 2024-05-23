import { PanelRow } from "@wordpress/components";
import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import ReactJson from "react-json-view";

export function NodeDevInfoPanel({node}) {
    return (
        <PanelBody title={__('Developer Info')} icon={'admin-tools'}>
            <PanelRow>
                <ReactJson src={node} collapsed={1} collapseStringsAfterLength={40} displayDataTypes={false} displayObjectSize={false} />
            </PanelRow>
        </PanelBody>
    );
}

export default NodeDevInfoPanel;
