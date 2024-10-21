import { store as workflowStore } from "../workflow-store";
import { store as editorStore } from "../editor-store";
import { useDispatch, useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { nodeHasIncomers, nodeHasOutgoers, getNodeIncomers, getNodeIncomersRecursively } from "../../utils";
import isEmail from "validator/lib/isEmail";
import isInt from "validator/lib/isInt";

export function NodeValidator({})
{
    const {
        nodes,
        edges,
        getNodeTypeByName,
    } = useSelect((select) => {
        return {
            nodes: select(workflowStore).getNodes(),
            edges: select(workflowStore).getEdges(),
            getNodeTypeByName: select(editorStore).getNodeTypeByName,
        }
    });

    const {
        addNodeError,
        resetNodeErrors,
    } = useDispatch(workflowStore);

    useEffect(() => {
        nodes.forEach((node) => {
            const nodeType = getNodeTypeByName(node.data?.name);
            const nodeSettings = node.data?.settings || {};
            const settingsSchema = nodeType?.settingsSchema;
            const validationSchema = nodeType?.validationSchema;

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
                                    __('This step requires a connection from a previous step.', 'post-expirator')
                                );
                            }
                            break;

                        case 'hasOutgoingConnection':
                            if (!nodeHasOutgoers(node)) {
                                addNodeError(
                                    node.id,
                                    'no-outgoers',
                                    __('This step requires a connection to a following step.', 'post-expirator')
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
                                            __('The field %s is required.', 'post-expirator'),
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
                                            __('The field %s is required.', 'post-expirator'),
                                            fieldLabel
                                        )
                                    );
                                }
                            }
                            break;

                        case 'dataType':
                            const type = ruleData.type;

                            if (settingValue === undefined || settingValue === null || settingValue === '') {
                                return;
                            }

                            if (type === 'email') {
                                if (! isEmail(settingValue)) {
                                    addNodeError(
                                        node.id,
                                        `${fieldName}-email`,
                                        sprintf(
                                            __('The field %s must be a valid email address.', 'post-expirator'),
                                            fieldLabel
                                        )
                                    );
                                }
                            } else if (type === 'emailList') {
                                const emails = settingValue.split(',');
                                let email;
                                for (let i = 0; i < emails.length; i++) {
                                    email = emails[i].trim();

                                    if (!isEmail(email)) {
                                        addNodeError(
                                            node.id,
                                            `${fieldName}-emailList`,
                                            sprintf(
                                                __('The field %s must be a valid email address list separated by commas.', 'post-expirator'),
                                                fieldLabel
                                            )
                                        );

                                        break;
                                    }
                                }
                            } else if (type === 'integer') {
                                if (!isInt(settingValue)) {
                                    addNodeError(
                                        node.id,
                                        `${fieldName}-integer`,
                                        sprintf(
                                            __('The field %s must be an integer.', 'post-expirator'),
                                            fieldLabel
                                        )
                                    );
                                }
                            } else if (type === 'integerList') {
                                let integer;
                                for (let i = 0; i < settingValue.length; i++) {
                                    integer = settingValue[i].trim();

                                    if (!isInt(integer)) {
                                        addNodeError(
                                            node.id,
                                            `${fieldName}-integerList`,
                                            sprintf(
                                                __('The field %s must be an integer list separated by commas.', 'post-expirator'),
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
