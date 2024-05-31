import { applyFilters } from "@wordpress/hooks";
import { select } from "@wordpress/data";
import { store as workflowStore } from "./components/workflow-store";
import { store as editorStore } from "./components/editor-store";
import { getIncomers, getOutgoers } from "reactflow";

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
                    });
                });
            } else {
                mappedInput.push({
                    ...outputItem,
                    name: `${previousNode.data.slug}.${outputItem.name}`,
                    type: outputItem.type,
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

export function getExpandedVariableOptionsForSelect(node, globalVariables) {
    const getDataTypeByName = select(workflowStore).getDataTypeByName;

    const mappedNodeInputs = mapNodeInputs(node);
    const globalVariablesToList = getGlobalVariablesExpanded(globalVariables);

    let options;
    mappedNodeInputs.concat(globalVariablesToList).forEach((variable) => {
        if (!options) {
            options = [];
        }

        const dataType = getDataTypeByName(variable.type);

        const optionToAdd = {
            id: variable.name,
            name: variable.label,
            children: [],
            type: variable?.type,
        };

        if (dataType.type === 'object') {
            optionToAdd.children = dataType.propertiesSchema.map((property) => {
                return {
                    id: variable.name + '.' + property.name,
                    name: variable.label + '->' + property.label,
                };
            });
        }

        options.push(optionToAdd);
    });

    return options;
}
