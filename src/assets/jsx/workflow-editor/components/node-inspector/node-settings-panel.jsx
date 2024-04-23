import { PanelBody } from "@wordpress/components";
import PostQueryField from "../data-field/post-query";
import { __, sprintf } from "@wordpress/i18n";
import { store as workflowStore } from "../workflow-store";
import { useDispatch } from "@wordpress/data";
import DateOffset from "../data-field/date-offset";
import Recurrence from "../data-field/recurrence";

export const NodeSettingsPanel = ({ selectedNode }) => {
    const settingsSchema = selectedNode?.data?.settingsSchema || {};

    const {
        setNodeSettings
    } = useDispatch(workflowStore);

    const onChangeSetting = (key, value) => {
        if (! selectedNode.data?.settings) {
            selectedNode.data.settings = {};
        }

        if (JSON.stringify(selectedNode.data.settings[key]) === JSON.stringify(value)) {
            return;
        }

        selectedNode.data.settings[key] = value;
        setNodeSettings(selectedNode.id, selectedNode.data.settings);
    };

    let nodeSettings = selectedNode.data?.settings;

    if (!nodeSettings) {
        nodeSettings = {};
    }

    const Field = ({ field }) => {
        const fieldSettings = nodeSettings[field.name] || {};

        switch (field.type) {
            case "post_query":
                return (
                    <PostQueryField field={field} settings={fieldSettings} onChange={onChangeSetting} />
                );
            case "date_offset":
                return (
                    <DateOffset field={field} settings={fieldSettings} onChange={onChangeSetting} />
                );
            case "recurrence":
                return (
                    <Recurrence field={field} settings={fieldSettings} onChange={onChangeSetting} />
                );
            default:
                return (
                    <i>{sprintf(__('%s not implemented', 'publihspress-future-pro'), field.name)}</i>
                );
        }
    }

    const panels = settingsSchema.map((setting) => {
        return (
            <PanelBody title={setting.label} key={setting.label}>
                {setting.fields.map((field) => {
                    return (
                        <Field key={field.name} field={field} />
                    );
                })}
            </PanelBody>
        );
    });

    // https://www.wpbrain.com/documentation/condition-builder/
    // Instead of adding a conditional filter to each trigger,
    // we can use the if/else node for that. The trigger output
    // the post/user, etc... and the if/else node will allow to
    // use that as an input variable.
    // Add an option to the trigger to set the post as global var?
    // Add a list of global vars (internally, at least) to the workflow: Current user, current date
    // Declare node's output vars somewhere

    return (
        <>
            {panels}
        </>
    );
};

export default NodeSettingsPanel;
