import { store as workflowStore } from "../workflow-store";
import { useDispatch, useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { nodeHasIncomers, nodeHasOutgoers } from "../../utils";
import validator from "validator";

export function NodeValidator({})
{
    const {
        nodes,
        edges,
    } = useSelect((select) => {
        return {
            nodes: select(workflowStore).getNodes(),
            edges: select(workflowStore).getEdges(),
        }
    });

    const {
        addNodeError,
        removeNodeError,
    } = useDispatch(workflowStore);

    useEffect(() => {
        nodes.forEach((node) => {
            const nodeSettings = node.data.settings || {};
            const settingsSchema = node.data.settingsSchema;

            // Check the node requires a connection
            if (node.type !== 'trigger' && !nodeHasIncomers(node)) {
                addNodeError(
                    node.id,
                    'no-incomers',
                    __('This node requires an incoming connection', 'publishpress-future-pro')
                );
            } else {
                removeNodeError(node.id, 'no-incomers');
            }

            // Check the trigger has a connection
            if (node.type === 'trigger' && !nodeHasOutgoers(node)) {
                addNodeError(
                    node.id,
                    'no-outgoers',
                    __('This trigger node requires an outgoing connection', 'publishpress-future-pro')
                );
            } else {
                removeNodeError(node.id, 'no-outgoers');
            }

            if (settingsSchema) {
                settingsSchema.forEach((settingPanel) => {
                    settingPanel.fields.forEach((field) => {
                        if (! field?.validation) {
                            return;
                        }

                        Object.keys(field.validation).forEach((fieldName) => {
                            const fieldNames = fieldName.split('.');
                            const rules = field.validation[fieldName];

                            // Support multiple levels of nested fields, separated by dots.
                            let settingValue = nodeSettings;
                            for (let i = 0; i < fieldNames.length; i++) {
                                settingValue = settingValue?.[fieldNames[i]];
                            }

                            const fieldLabelToDisplay = rules.label || field.label;

                            if (rules?.required) {
                                if (rules.required === true && (!settingValue || settingValue == '')) {
                                    addNodeError(
                                        node.id,
                                        `${fieldName}-required`,
                                        sprintf(
                                            __('The field %s is required', 'publishpress-future-pro'),
                                            fieldLabelToDisplay
                                        )
                                    );
                                } else {
                                    removeNodeError(node.id, `${fieldName}-required`);
                                }

                                if (rules.required?.condition) {
                                    const conditionField = rules.required.condition.field;
                                    const conditionValue = rules.required.condition.value;

                                    let conditionSettingValue = nodeSettings;
                                    for (let i = 0; i < conditionField.split('.').length; i++) {
                                        conditionSettingValue = conditionSettingValue?.[conditionField.split('.')[i]];
                                    }

                                    if (conditionSettingValue == conditionValue && (!settingValue || settingValue == '')) {
                                        addNodeError(
                                            node.id,
                                            `${fieldName}-required-if`,
                                            sprintf(
                                                __('The field %s is required', 'publishpress-future-pro'),
                                                fieldLabelToDisplay
                                            )
                                        );
                                    } else {
                                        removeNodeError(node.id, `${fieldName}-required-if`);
                                    }
                                }
                            } else {
                                removeNodeError(node.id, `${fieldName}-required`);
                                removeNodeError(node.id, `${fieldName}-required-if`);
                            }

                            if (settingValue && rules?.format) {
                                if (rules.format === 'email') {
                                    if (!validator.isEmail(settingValue)) {
                                        addNodeError(
                                            node.id,
                                            `${fieldName}-email`,
                                            sprintf(
                                                __('The field %s must be a valid email address', 'publishpress-future-pro'),
                                                fieldLabelToDisplay
                                            )
                                        );
                                    } else {
                                        removeNodeError(node.id, `${fieldName}-email`);
                                    }
                                } else {
                                    removeNodeError(node.id, `${fieldName}-email`);
                                }

                                if (rules.format === 'emailCSV') {
                                    const emails = settingValue.split(',');
                                    let email;
                                    for (let i = 0; i < emails.length; i++) {
                                        email = emails[i].trim();

                                        if (!validator.isEmail(email)) {
                                            addNodeError(
                                                node.id,
                                                `${fieldName}-emailCSV`,
                                                sprintf(
                                                    __('The field %s must be a valid email address list separated by commas', 'publishpress-future-pro'),
                                                    fieldLabelToDisplay
                                                )
                                            );

                                            break;
                                        } else {
                                            removeNodeError(node.id, `${fieldName}-emailCSV`);
                                        }
                                    }
                                } else {
                                    removeNodeError(node.id, `${fieldName}-emailCSV`);
                                }

                                if (rules.format === 'integer' && settingValue && settingValue?.trim() !== '') {
                                    if (!validator.isInt(settingValue)) {
                                        addNodeError(
                                            node.id,
                                            `${fieldName}-integer`,
                                            sprintf(
                                                __('The field %s must be an integer', 'publishpress-future-pro'),
                                                fieldLabelToDisplay
                                            )
                                        );
                                    } else {
                                        removeNodeError(node.id, `${fieldName}-integer`);
                                    }
                                } else {
                                    removeNodeError(node.id, `${fieldName}-integer`);
                                }

                                if (rules.format === 'integerCSV' && settingValue && settingValue?.trim() !== '') {
                                    const integers = settingValue.split(',');
                                    let integer;
                                    for (let i = 0; i < integers.length; i++) {
                                        integer = integers[i].trim();

                                        if (!validator.isInt(integer)) {
                                            addNodeError(
                                                node.id,
                                                `${fieldName}-integerCSV`,
                                                sprintf(
                                                    __('The field %s must be an integer list separated by commas', 'publishpress-future-pro'),
                                                    fieldLabelToDisplay
                                                )
                                            );

                                            break;
                                        } else {
                                            removeNodeError(node.id, `${fieldName}-integerCSV`);
                                        }
                                    }
                                } else {
                                    removeNodeError(node.id, `${fieldName}-integerCSV`);
                                }

                                if (rules.format === 'integerList' && settingValue && settingValue?.length > 0) {
                                    let integer;
                                    for (let i = 0; i < settingValue.length; i++) {
                                        integer = settingValue[i].trim();

                                        if (!validator.isInt(integer)) {
                                            addNodeError(
                                                node.id,
                                                `${fieldName}-integerList`,
                                                sprintf(
                                                    __('The field %s must be an integer list', 'publishpress-future-pro'),
                                                    fieldLabelToDisplay
                                                )
                                            );

                                            break;
                                        } else {
                                            removeNodeError(node.id, `${fieldName}-integerList`);
                                        }
                                    }
                                } else {
                                    removeNodeError(node.id, `${fieldName}-integerList`);
                                }
                            }
                        });
                    });
                });
            }
        });
    }, [nodes, edges]);

    return;
}

export default NodeValidator;
