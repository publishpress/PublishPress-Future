import { PanelRow, TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import PersistentPanelBody from "../persistent-panel-body";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as workflowStore } from '../workflow-store';
import { store as editorStore } from '../editor-store';
import { useCallback } from "@wordpress/element";
import Text from "../data-fields/text";

export const NodeDetailsPanel = ({ node }) => {
    const {
        getNodeTypeByName,
    } = useSelect((select) => {
        return {
            getNodeTypeByName: select(editorStore).getNodeTypeByName,
        };
    });

    const {
        updateNode,
    } = useDispatch(workflowStore);

    const nodeType = getNodeTypeByName(node.data.name);

    const onChangeLabel = useCallback((name, value) => {
        const newNode = {
            ...node,
            data: {
                ...node.data,
                label: value,
            },
        };

        updateNode(newNode);
    }, [node, updateNode]);

    return (
        <PersistentPanelBody title={__("Step Details", "post-expirator")}>
            <PanelRow>
                <Text
                    name="label"
                    label={__("Step Label", "post-expirator")}
                    defaultValue={node.data.label || ''}
                    settings={{
                        placeholder: nodeType.label,
                    }}
                    onChange={onChangeLabel}
                    description={__("This is the label that will be displayed in the workflow editor.", "post-expirator")}
                />
            </PanelRow>
        </PersistentPanelBody>
    );
};

export default NodeDetailsPanel;
