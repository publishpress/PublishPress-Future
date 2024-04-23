import { PanelBody } from "@wordpress/components";
import PostQuery from "../data-field/post-query";
import { __, sprintf } from "@wordpress/i18n";
import { store as workflowStore } from "../workflow-store";
import { useDispatch } from "@wordpress/data";
import Recurrence from "../data-field/recurrence";
import { TextControl } from "@wordpress/components";
import { useState, useCallback, useMemo } from "@wordpress/element";
import { DateOffset } from "../data-field/date-offset";

const DynamicField = ({ type, name, label, value, onChange }) => {
    switch (type) {
        // case "post_query":
        //     return (
        //         <PostQuery field={field} node={selectedNode} />
        //     );
        case "date_offset":
            return (
                <DateOffset name={name} label={label} defaultValue={value} onChange={onChange} />
            );
        // case "recurrence":
        //     return (
        //         <Recurrence field={field} node={selectedNode} />
        //     );
    }

    return (
        <i>{sprintf(__('Field type %s is not implemented', 'publihspress-future-pro'), name)}</i>
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

    const panels = useMemo(() => {
        return settingsSchema.map((settingPanel) => {
            return (
                <PanelBody title={settingPanel.label} key={settingPanel.label}>
                    {settingPanel.fields.map((field) => {
                        return (
                            <DynamicField
                                key={settingPanel.label + '-' + field.name}
                                type={field.type}
                                name={field.name}
                                label={field.label}
                                value={nodeSettings?.[field.name]}
                                onChange={onChangeSetting}
                            />
                        );
                    })}
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
