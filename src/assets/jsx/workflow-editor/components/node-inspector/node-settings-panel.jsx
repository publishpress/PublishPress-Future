import { PanelBody } from "@wordpress/components";
import PostQuery from "../data-fields/post-query";
import { __, sprintf } from "@wordpress/i18n";
import { store as workflowStore } from "../workflow-store";
import { useDispatch } from "@wordpress/data";
import Recurrence from "../data-fields/recurrence";
import { useMemo } from "@wordpress/element";
import { DateOffset } from "../data-fields/date-offset";
import BaseField from "../data-fields/base-field";
import { getNodeInputs, getNodeInputVariablesByType } from "../../utils";

const DynamicField = (props) => {
    switch (props.type) {
        case "post_query":
            return (
                <PostQuery {...props} />
            );
        case "date_offset":
            return (
                <DateOffset {...props} />
            );
        case "recurrence":
            return (
                <Recurrence {...props} />
            );
    }

    return (
        <i>{sprintf(__('Field type %s is not implemented', 'publihspress-future-pro'), props.name)}</i>
    );
}

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

    const nodeInputVariables = getNodeInputVariablesByType(node, ['string', 'date']);

    const panels = useMemo(() => {
        return settingsSchema.map((settingPanel) => {
            return (
                <PanelBody title={settingPanel.label} key={settingPanel.label}>
                    <BaseField description={settingPanel?.description}>
                        {settingPanel.fields.map((field) => {
                            return (
                                <DynamicField
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
