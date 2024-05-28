import { PanelRow } from "@wordpress/components";
import { store as workflowStore } from "../workflow-store";
import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { getExpandedVariableOptionsForSelect } from "../../utils";
import MappedField from "./mapped-field";
import PersistentPanelBody from "../persistent-panel-body";

export const NodeSettingsPanel = ({ node }) => {
    const {
        globalVariables,
        getDataTypeByName,
    } = useSelect((select) => {
        return {
            globalVariables: select(workflowStore).getGlobalVariables(),
            getDataTypeByName: select(workflowStore).getDataTypeByName,
        }
    });

    const {
        updateNode
    } = useDispatch(workflowStore);

    const onChangeSetting = (fieldName, value) => {
        if (! node.data?.settings) {
            node.data.settings = {};
        }

        node.data.settings = {
            ...node.data.settings,
            [fieldName]: value
        }

        updateNode(node);
    };

    let nodeSettings = node.data?.settings;

    if (!nodeSettings) {
        nodeSettings = {};
    }
    const settingsSchema = node?.data?.settingsSchema || {};

    const variableListOptions = getExpandedVariableOptionsForSelect(node, globalVariables);

    const settingsPanels = useMemo(() => {
        return settingsSchema.map((settingPanel) => {
            return (
                <PersistentPanelBody title={settingPanel.label} key={settingPanel.label}>
                    {settingPanel?.description && (
                        <PanelRow>
                            <div className="settings-field-description">{settingPanel?.description}</div>
                        </PanelRow>
                    )}

                    {settingPanel.fields.map((field) => {
                        return (
                            <PanelRow key={settingPanel.label + '-' + field.name}>
                                <MappedField
                                    type={field.type}
                                    name={field.name}
                                    description={field?.description}
                                    label={field.label}
                                    defaultValue={nodeSettings?.[field.name]}
                                    onChange={onChangeSetting}
                                    variables={variableListOptions}
                                    settings={field?.settings}
                                />
                            </PanelRow>
                        );
                    })}
                </PersistentPanelBody>
            );
        });
    }, [settingsSchema, nodeSettings]);

    return (
        <>
            {settingsPanels}
        </>
    );
};

export default NodeSettingsPanel;
