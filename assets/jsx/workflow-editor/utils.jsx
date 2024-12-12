import { applyFilters } from "@wordpress/hooks";
import { select, dispatch } from "@wordpress/data";
import { store as workflowStore } from "./components/workflow-store";
import { store as editorStore } from "./components/editor-store";
import { getIncomers, getOutgoers } from "reactflow";
import { NODE_TYPE_PLACEHOLDER } from "./constants";

const VARIABLE_SOURCE_NODE_INPUT = 'node-input';
const VARIABLE_SOURCE_GLOBAL = 'global';

export function addBodyClass(className) {
    if (document.body.classList.contains(className)) return;

    document.body.classList.add(className);
}

export function removeBodyClass(className) {
    if (!document.body.classList.contains(className)) return;

    document.body.classList.remove(className);
}

export function addBodyClasses(classNames) {
    classNames.forEach((className) => addBodyClass(className));
}

export function removeBodyClasses(classNames) {
    classNames.forEach((className) => removeBodyClass(className));
}

/**
 * Returns the block's default menu item classname from its name.
 *
 * @param {string} blockName The block name.
 *
 * @return {string} The block's default menu item class.
 */
export function getNodeMenuDefaultClassName(blockName) {
    // Generated HTML classes for blocks follow the `editor-block-list-item-{name}` nomenclature.
    // Blocks provided by WordPress drop the prefixes 'core/' or 'core-' (historically used in 'core-embed/').
    const className =
        "editor-block-list-item-" +
        blockName.replace(/\//, "-").replace(/^core-/, "");

    return applyFilters(
        "future-pro.getNodeMenuDefaultClassName",
        className,
        blockName,
    );
}

/**
 * Return true if platform is MacOS.
 *
 * @param {Object} _window window object by default; used for DI testing.
 *
 * @return {boolean} True if MacOS; false otherwise.
 */
export function isAppleOS(_window = window) {
    const { platform } = _window.navigator;

    return (
        platform.indexOf("Mac") !== -1 || ["iPad", "iPhone"].includes(platform)
    );
}

export function getNodeIncomers(node) {
    const nodes = select(workflowStore).getNodes();
    const edges = select(workflowStore).getEdges();

    if (!node) return [];

    return getIncomers(node, nodes, edges);
}

export function getNodeIncomersRecursively(node) {
    const incomers = getNodeIncomers(node);

    if (!incomers.length) {
        return [];
    }

    let allIncomers = incomers;

    incomers.forEach((incomer) => {
        const incomerIncomers = getNodeIncomersRecursively(incomer);

        allIncomers = allIncomers.concat(incomerIncomers);
    });

    return allIncomers;
}

export function nodeHasIncomers(node) {
    const incomers = getNodeIncomers(node);
    const nodeHasIncomers = incomers?.length > 0;

    return nodeHasIncomers;
}

export function getNodeOutgoers(node) {
    const nodes = select(workflowStore).getNodes();
    const edges = select(workflowStore).getEdges();

    if (!node) return [];

    return getOutgoers(node, nodes, edges);
}

export function nodeHasOutgoers(node) {
    const outgoers = getNodeOutgoers(node);
    const nodeHasOutgoers = outgoers?.length > 0;

    return nodeHasOutgoers;
}

export function nodeHasInput(node) {
    const nodeType = select(editorStore).getNodeTypeByName(node?.data?.name);

    const incomers = getNodeIncomers(node);
    const nodeHasIncomers = incomers?.length > 0;
    const nodeHasInput = nodeHasIncomers && incomers.filter((incomer) => nodeType?.outputSchema?.length > 0)?.length > 0;

    return nodeHasInput;
}

export function nodeHasOutput(node) {
    const nodeType = select(editorStore).getNodeTypeByName(node?.data?.name);
    const nodeHasOutput = nodeType?.outputSchema?.length > 0;

    return nodeHasOutput;
}

export function getNodeInputs(node) {
    const nodeType = select(editorStore).getNodeTypeByName(node?.data?.name);
    const incomers = getNodeIncomers(node);
    const nodeHasIncomers = incomers?.length > 0;

    const getDataTypeByName = select(workflowStore).getDataTypeByName;

    if (!nodeHasIncomers) {
        return [];
    }

    let nodeInputs = [];

    incomers.forEach((incomer) => {
        if (!nodeType?.outputSchema?.length) {
            return;
        }

        nodeType?.outputSchema.forEach((schemaItem) => {
            const dataType = getDataTypeByName(schemaItem.type);

            // If input, look for the previous node inputs to bypass as this node's input
            if (schemaItem.type === 'input') {
                const previousNodeInputs = getNodeInputs(incomer);

                nodeInputs = nodeInputs.concat(previousNodeInputs);
            } else {
                nodeInputs.push({
                    incomerId: incomer.id,
                    name: schemaItem.name,
                    type: schemaItem.type,
                    label: schemaItem.label,
                    description: schemaItem.description,
                    dataType: dataType,
                });
            }
        });
    });

    // Make sure we don't have repeated inputs, #712
    nodeInputs = nodeInputs.filter((input, index, self) =>
        index === self.findIndex((t) => (
            t.name === input.name && t.type === input.type
        ))
    );

    return nodeInputs;
}

export function getNodeInputVariables(node, types = [], addInputPrefix = true) {
    const nodeInputs = getNodeInputs(node);

    let variables = [];

    if (types.length) {
        variables = nodeInputs.filter((input) => types.includes(input.type));
    } else {
        variables = nodeInputs;
    }

    variables = variables.map((variable) => {
        const variableName = addInputPrefix ? 'input.' + variable.name : variable.name;

        return {
            name: variableName,
            type: variable.type,
            label: variable.label,
            source: VARIABLE_SOURCE_NODE_INPUT,
        };
    });

    return variables;
}

export function getGlobalVariablesExpanded(globalVariables) {
    const globalVariablesExpanded = [];

    Object.keys(globalVariables).forEach((variableName) => {
        const variable = globalVariables[variableName];

        globalVariablesExpanded.push({
            name: variableName,
            type: variable.type,
            label: variable.label,
            source: VARIABLE_SOURCE_GLOBAL,
            description: variable.description,
        });
    });

    // Add "global." prefix to all global variables
    globalVariablesExpanded.forEach((variable) => {
        variable.name = 'global.' + variable.name;
    });

    return globalVariablesExpanded;
}

export function mapNodeInputs(node) {
    const getNodeTypeByName = select(editorStore).getNodeTypeByName;
    const previousNodes = getNodeIncomers(node);

    const mappedInput = [];

    previousNodes.forEach((previousNode) => {
        const nodeType = getNodeTypeByName(previousNode.data?.name);

        if (!nodeType?.outputSchema?.length) {
            return;
        }

        nodeType.outputSchema.forEach((outputItem) => {
            if (outputItem.type === "input") {
                // Get the previous node outputs to bypass to this node as input
                const previousNodeInputs = mapNodeInputs(previousNode);

                previousNodeInputs.map((inputItem) => {
                    mappedInput.push({
                        ...inputItem,
                        name: `${inputItem.name}`,
                        type: inputItem.type,
                        nodeLabel: nodeType.label,
                    });
                });
            } else {
                mappedInput.push({
                    ...outputItem,
                    name: `${previousNode.data.slug}.${outputItem.name}`,
                    type: outputItem.type,
                    nodeLabel: nodeType.label,
                });
            }
        });
    });

    // Remove duplicated inputs
    const uniqueMappedInputs = mappedInput.filter(
        (input, index, self) =>
            index ===
            self.findIndex(
                (t) => t.name === input.name,
            ),  // eslint-disable-line
    );

    // Sort inputs by name
    uniqueMappedInputs.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }

        if (a.name > b.name) {
            return 1;
        }

        return 0;
    });

    return uniqueMappedInputs;
}

export function getExpandedVariablesList(node, globalVariables) {
    const variablesList = getVariablesList(node, globalVariables);

    var expandedList = [];
    variablesList.forEach((variable) => {
        expandedList.push(
            expandVariableToOptions(variable)
        );
    });

    return expandedList;
}

function getVariablesList(node, globalVariables) {
    const mappedNodeInputs = mapNodeInputs(node);
    const globalVariablesToList = getGlobalVariablesExpanded(globalVariables);

    return [...mappedNodeInputs, ...globalVariablesToList];
}

function convertVariableToOptions(variable) {
    return {
        name: variable.name,
        label: variable.label,
        children: [],
        type: variable.type,
        itemsType: variable?.itemsType,
        description: variable?.description,
    };
}

function getVariableProperties(variable) {
    const getDataTypeByName = select(workflowStore).getDataTypeByName;
    const dataType = getDataTypeByName(variable.type);

    return dataType.propertiesSchema.map((property) => {
        return {
            name: variable.name + '.' + property.name,
            label: property.label,
            type: property?.type,
            itemsType: property?.itemsType,
            description: property?.description,
        };
    });
}

function expandVariableToOptions(variable) {
    const getDataTypeByName = select(workflowStore).getDataTypeByName;
    const dataType = getDataTypeByName(variable.type);

    const option = convertVariableToOptions(variable);

    // If the variable is an object, add its properties as children
    if (dataType.type === 'object') {
        option.children = getVariableProperties(variable);
    }

    return option;
}

export function isValidDataType(dataType, expectedDataTypes) {
    let hasValidDataType = true;

    if (expectedDataTypes?.length) {
        hasValidDataType = expectedDataTypes.includes(dataType?.type);

        if (dataType?.type === 'object' && !hasValidDataType) {
            hasValidDataType = expectedDataTypes.includes(dataType?.objectType);
        }
    }

    return hasValidDataType;
}

export function filterVariableOptionsByDataType(variables, expectedDataTypes) {
    const getDataTypeByName = select(workflowStore).getDataTypeByName;
    let filteredVariables = [];

    variables.forEach((variable) => {
        const dataType = getDataTypeByName(variable.type);
        const itemsType = variable?.itemsType;
        let variableHasValidDataType = isValidDataType(dataType, expectedDataTypes);

        if (variable.type === 'array' && itemsType && !variableHasValidDataType) {
            const expectedItemsDataTypes = expectedDataTypes.map((type) => {
                if (type.startsWith('array:')) {
                    return type.replace('array:', '');
                }

                return null;
            });

            const itemsDataType = getDataTypeByName(itemsType);
            variableHasValidDataType = isValidDataType(itemsDataType, expectedItemsDataTypes);
        }

        let validVariable = null;
        let validChildren = [];

        // Desn't include the variable properties if the variable itself is invalid
        if (dataType.type === 'object') {
            const properties = dataType.propertiesSchema;

            // Ignore the properties if the variable itself is valid.
            properties.forEach((property) => {
                const propertyDataType = getDataTypeByName(property.type);
                const propertyHasValidDataType = isValidDataType(propertyDataType, expectedDataTypes);

                if (propertyHasValidDataType) {
                    validChildren.push({
                        id: variable.id + '.' + property.name,
                        name: variable.name + ' -> ' + property.label,
                    });
                }
            });

            validVariable = {
                id: variable.id,
                name: variable.name,
                children: validChildren,
                type: variable.type,
            };

            if (variableHasValidDataType) {
                filteredVariables.push(validVariable);
            } else if (validChildren.length) {
                filteredVariables = filteredVariables.concat(validChildren);
            }
        } else {
            if (variableHasValidDataType) {
                filteredVariables.push(variable);
            }
        }
    });

    return filteredVariables;
}

export const getId = (prefix = "node") => {
    // We are subtracting the current date from the date 2024-01-01,
    // and using a 32 base number to get a smaller number
    const currentTimestamp = new Date().getTime();
    const pastTimestamp = new Date('2024-01-01 00:00:00').getTime();

    const UID = (currentTimestamp - pastTimestamp).toString(32);

    return `${prefix}_${UID}`
};

export function incrementAndGetNodeSlug(nodeItem) {
    const nodeType = select(editorStore).getNodeTypeByName(nodeItem.name);
    const baseSlugCounts = select(workflowStore).getBaseSlugCounts();

    let baseSlug = nodeType.baseSlug;

    if (!baseSlug) {
        baseSlug = "node";
    }

    dispatch(workflowStore).incrementBaseSlugCounts(baseSlug);

    const count = baseSlugCounts[baseSlug] || 0;

    return `${baseSlug}${count + 1}`;
};

export function createNewNode({item, position, reactFlowInstance}) {
    const slug = incrementAndGetNodeSlug(item);
    let nodes = select(workflowStore).getNodes();

    const idPrefix = item.baseSlug ?? "node";

    const newNode = {
        id: getId(idPrefix),
        type: item.type,
        position: position,
        data: {
            name: item.name,
            elementaryType: item.elementaryType,
            version: item.version,
            slug: slug,
            settings: {},
        },
    };

    // Add default settings values if specified in the node type settings schema.
    if (item.settingsSchema) {
        item.settingsSchema.forEach((panel) => {
            panel.fields.forEach((field) => {
                if (field.default === undefined) {
                    return;
                }

                newNode.data.settings[field.name] = field.default;
            });
        });
    }

    nodes = nodes.filter((node) => node.data.elementaryType !== NODE_TYPE_PLACEHOLDER);

    dispatch(workflowStore).setNodes(nodes.concat(newNode));

    updateFlowInEditedWorkflow(reactFlowInstance);

    return newNode;
}

export function updateFlowInEditedWorkflow(reactFlowInstance) {
    // We need to delay the update of the flow to avoid missing the changes.
    setTimeout(() => {
        dispatch(workflowStore).setEditedWorkflowAttribute("flow", reactFlowInstance.toObject());
    }, 400);
}

export const newTriggerPlaceholderNode = () => {
    return {
        id: getId("triggerPlaceholder"),
        type: 'triggerPlaceholder',
        position: { x: 0, y: 0 },
        data: {
            name: 'placeholder/trigger',
            elementaryType: NODE_TYPE_PLACEHOLDER,
            version: 1,
            slug: 'triggerPlaceholder1',
        },
    };
}
