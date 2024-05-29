import { store as workflowStore } from "../workflow-store";
import { useDispatch, useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { nodeHasIncomers, nodeHasOutgoers, getNodeIncomers, getNodeIncomersRecursively } from "../../utils";
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
        resetNodeErrors,
    } = useDispatch(workflowStore);

    useEffect(() => {
        nodes.forEach((node) => {
            const nodeSettings = node.data?.settings || {};
            const settingsSchema = node.data?.settingsSchema;
            const validationSchema = node.data?.validationSchema;

            resetNodeErrors(node.id);

            if (! validationSchema) {
                return;
            }

            if (validationSchema?.connections?.rules) {
                validationSchema.connections.rules.forEach((ruleData) => {
                    switch(ruleData.rule) {
                        case 'hasIncomingConnection':
                            if (!nodeHasIncomers(node)) {
                                addNodeError(
                                    node.id,
                                    'no-incomers',
                                    __('This step requires a connection from a previous step', 'publishpress-future-pro')
                                );
                            }
                            break;

                        case 'hasOutgoingConnection':
                            if (!nodeHasOutgoers(node)) {
                                addNodeError(
                                    node.id,
                                    'no-outgoers',
                                    __('This step requires a connection to a following step', 'publishpress-future-pro')
                                );
                            }
                            break;

                        case 'hasIncomerOfName':
                            const allIncomers = getNodeIncomersRecursively(node);

                            let hasError = false;

                            if (allIncomers.length === 0) {
                                hasError = true;
                            } else {
                                var hasIncomerOfName = false;
                                allIncomers.forEach((incomer) => {
                                    if (incomer.data?.name === ruleData.name) {
                                        hasIncomerOfName = true;
                                    }
                                });

                                hasError = !hasIncomerOfName;
                            }

                            if (hasError) {
                                addNodeError(
                                    node.id,
                                    'parent-name',
                                    ruleData.message,
                                );
                            }
                            break;
                    }
                });
            }

            if (validationSchema?.settings?.rules) {
                validationSchema.settings.rules.forEach((ruleData) => {
                    const rule = ruleData.rule;
                    const fieldName = ruleData?.field || '';
                    const fieldNames = fieldName?.split('.') || [];
                    const fieldLabel = ruleData?.label || settingsSchema.find((panel) => panel?.fields.find((field) => field.name === fieldNames[0]))?.label;

                    let settingValue = nodeSettings;
                    for (let i = 0; i < fieldNames.length; i++) {
                        settingValue = settingValue?.[fieldNames[i]];
                    }

                    switch(rule) {
                        case 'required':
                            if (ruleData?.condition) {
                                const conditionField = ruleData.condition.field;
                                const conditionValue = ruleData.condition.value;

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
                                            fieldLabel
                                        )
                                    );
                                }
                            } else {
                                if (!settingValue || settingValue == '') {
                                    addNodeError(
                                        node.id,
                                        `${fieldName}-required`,
                                        sprintf(
                                            __('The field %s is required', 'publishpress-future-pro'),
                                            fieldLabel
                                        )
                                    );
                                }
                            }
                            break;

                        case 'format':
                            const format = ruleData.format;

                            if (settingValue === undefined || settingValue === null || settingValue === '') {
                                return;
                            }

                            if (format === 'email') {
                                if (! validator.isEmail(settingValue)) {
                                    addNodeError(
                                        node.id,
                                        `${fieldName}-email`,
                                        sprintf(
                                            __('The field %s must be a valid email address', 'publishpress-future-pro'),
                                            fieldLabel
                                        )
                                    );
                                }
                            } else if (format === 'emailList') {
                                const emails = settingValue.split(',');
                                let email;
                                for (let i = 0; i < emails.length; i++) {
                                    email = emails[i].trim();

                                    if (!validator.isEmail(email)) {
                                        addNodeError(
                                            node.id,
                                            `${fieldName}-emailList`,
                                            sprintf(
                                                __('The field %s must be a valid email address list separated by commas', 'publishpress-future-pro'),
                                                fieldLabel
                                            )
                                        );

                                        break;
                                    }
                                }
                            } else if (format === 'integer') {
                                if (!validator.isInt(settingValue)) {
                                    addNodeError(
                                        node.id,
                                        `${fieldName}-integer`,
                                        sprintf(
                                            __('The field %s must be an integer', 'publishpress-future-pro'),
                                            fieldLabel
                                        )
                                    );
                                }
                            } else if (format === 'integerList') {
                                let integer;
                                for (let i = 0; i < settingValue.length; i++) {
                                    integer = settingValue[i].trim();

                                    if (!validator.isInt(integer)) {
                                        addNodeError(
                                            node.id,
                                            `${fieldName}-integerList`,
                                            sprintf(
                                                __('The field %s must be an integer list separated by commas', 'publishpress-future-pro'),
                                                fieldLabel
                                            )
                                        );

                                        break;
                                    }
                                }
                            }

                            break;
                    }
                });
            }
        });
    }, [nodes, edges]);

    return;
}

export default NodeValidator;
