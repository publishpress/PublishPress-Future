import { store as workflowStore } from "../workflow-store";
import { store as editorStore } from "../editor-store";
import { useDispatch, useSelect } from "@wordpress/data";
import { useEffect, useMemo, useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { nodeHasIncomers, nodeHasOutgoers, getNodeIncomers, getNodeIncomersRecursively } from "../../utils";
import isEmail from "validator/lib/isEmail";
import isInt from "validator/lib/isInt";
import { debounce } from "lodash";

function isVariable(value) {
    const trimmedValue = value.trim();
    return trimmedValue.startsWith('{{') && trimmedValue.endsWith('}}');
}

const DEBOUNCE_TIME = 250;

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

    const nodeSlugs = useMemo(() => {
        return nodes.map((node) => {
            return node.data.slug;
        });
    }, [nodes]);

    // We are doing a simple validation here. Maybe we should do a more complex one using a parser in the future.
    const isExpressionValid = useCallback((expression, ruleData) => {
        let invalidExpression = false;
        let detailsMessage = '';

        const successfulResult = {
            isValid: true,
            error: null,
        };

        if (! expression?.includes('{{')) {
            return successfulResult;
        }

        const slugs = expression.match(/{{[^}]+}}/g);

        if (slugs) {
            slugs.forEach((slug) => {
                slug = slug.replace('{{', '').replace('}}', '');
                slug = slug.trim();
                slug = slug.split('.')[0];

                if (slug === 'global') {
                    return successfulResult;
                }

                if (ruleData?.allowedSlugs?.includes(slug)) {
                    return successfulResult;
                }

                if (! nodeSlugs.includes(slug)) {
                    invalidExpression = true;
                    detailsMessage = sprintf(
                        // translators: %s is the workflow step slug.
                        __('"%s" is not a variable or step slug.', 'post-expirator'),
                        slug
                    );
                }
            });
        }

        if (invalidExpression) {
            return {
                isValid: false,
                error: sprintf(
                    // translators: %s is the field label.
                    __('Invalid expression on %s', 'post-expirator'),
                    ruleData?.fieldLabel
                ),
                details: detailsMessage,
            }
        }

        return successfulResult;
    }, [nodeSlugs]);

    const validateNodes = useCallback((nodes, edges, nodeSlugs) => {
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

                                    if (!isEmail(email) && ! isVariable(email)) {
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

                        case 'validExpression':
                            const expressionValidation = isExpressionValid(settingValue, ruleData);

                            if (!expressionValidation.isValid) {
                                addNodeError(
                                    node.id,
                                    `${fieldName}-validExpression`,
                                    expressionValidation.error,
                                    expressionValidation.details
                                );
                            }
                            break;
                    }
                });
            }
        });
    }, [getNodeTypeByName, addNodeError, resetNodeErrors, isExpressionValid]);

    useEffect(() => {
        const debounceValidation = debounce(() => {
            validateNodes(nodes, edges, nodeSlugs);
        }, DEBOUNCE_TIME);

        debounceValidation();

        return () => {
            debounceValidation.cancel();
        };
    }, [nodes, edges, nodeSlugs, validateNodes]);

    return;
}

export default NodeValidator;
