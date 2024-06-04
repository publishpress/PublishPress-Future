import { PanelRow } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import ReactJson from "react-json-view";
import PersistentPanelBody from "../persistent-panel-body";

export function NodeDevInfoPanel({node, nodeType}) {
    const reactJSONParams = {
        collapsed: 1,
        collapseStringsAfterLength: 50,
        displayDataTypes: false,
        displayObjectSize: false,
        enableClipboard: false,
    };

    return (
        <PersistentPanelBody
            title={__('Developer Info', 'publishpress-future-pro')}
            icon={'admin-tools'}
            className="workflow-editor-dev-info-panel workflow-editor-dev-panel"
        >
            {node && (
                <PanelRow>
                    <div>
                        <h3>{__('Node', 'publishpress-future-pro')}</h3>
                        <div className="workflow-editor-dev-info-wrapper">
                            <ReactJson src={node} {...reactJSONParams} />
                        </div>
                    </div>
                </PanelRow>
            )}

            {nodeType && (
                <PanelRow>
                    <div>
                        <h3>{__('Node Type', 'publishpress-future-pro')}</h3>
                        <div className="workflow-editor-dev-info-wrapper">
                            <ReactJson src={nodeType} {...reactJSONParams} />
                        </div>
                    </div>
                </PanelRow>
            )}
        </PersistentPanelBody>
    );
}

export default NodeDevInfoPanel;
