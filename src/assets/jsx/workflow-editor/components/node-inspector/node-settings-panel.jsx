import { PanelBody } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { store as workflowStore } from "../workflow-store";
import { useDispatch } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import BaseField from "../data-fields/base-field";
import { getNodeInputVariables } from "../../utils";
import MappedField from "./mapped-field";

export const NodeSettingsPanel = ({ node }) => {
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

    const nodeInputVariables = getNodeInputVariables(node);

    const panels = useMemo(() => {
        return settingsSchema.map((settingPanel) => {
            return (
                <PanelBody title={settingPanel.label} key={settingPanel.label}>
                    <BaseField description={settingPanel?.description}>
                        {settingPanel.fields.map((field) => {
                            return (
                                <MappedField
                                    key={settingPanel.label + '-' + field.name}
                                    type={field.type}
                                    name={field.name}
                                    description={field?.description}
                                    label={field.label}
                                    defaultValue={nodeSettings?.[field.name]}
                                    onChange={onChangeSetting}
                                    variables={nodeInputVariables}
                                />
                            );
                        })}
                    </BaseField>
                </PanelBody>
            );
        });
    }, [settingsSchema, nodeSettings]);

    return (
        <>
            {panels}
        </>
    );
};

export default NodeSettingsPanel;
