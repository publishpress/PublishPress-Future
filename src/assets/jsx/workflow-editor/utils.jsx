import { applyFilters } from "@wordpress/hooks";
import { select } from "@wordpress/data";
import { store as workflowStore } from "./components/workflow-store";
import { getIncomers } from "reactflow";

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

export function nodeHasIncomers(node) {
    const incomers = getNodeIncomers(node);
    const nodeHasIncomers = incomers?.length > 0;

    return nodeHasIncomers;
}

export function nodeHasInput(node) {
    const incomers = getNodeIncomers(node);
    const nodeHasIncomers = incomers?.length > 0;
    const nodeHasInput = nodeHasIncomers && incomers.filter((incomer) => incomer.data?.outputSchema?.length > 0)?.length > 0;

    return nodeHasInput;
}

export function getNodeInputs(node) {
    const incomers = getNodeIncomers(node);
    const nodeHasIncomers = incomers?.length > 0;

    const getDataTypeByName = select(workflowStore).getDataTypeByName;

    if (!nodeHasIncomers) {
        return [];
    }

    let nodeInputs = [];

    incomers.forEach((incomer) => {
        if (!incomer.data?.outputSchema?.length) {
            return;
        }

        incomer.data.outputSchema.forEach((schemaItem) => {
            const dataType = getDataTypeByName(schemaItem.type);

            // If input, look for the previous node inputs to bypass as this node's input
            if (schemaItem.type === 'input') {
                const previousNodeInputs = getNodeInputs(incomer);

                nodeInputs = nodeInputs.concat(previousNodeInputs);
            } else {
                nodeInputs.push({
                    name: schemaItem.name,
                    type: schemaItem.type,
                    label: schemaItem.label,
                    description: schemaItem.description,
                    dataType: dataType,
                });
            }
        });
    });

    return nodeInputs;
}

export function getNodeInputVariables(node, types = []) {
    const nodeInputs = getNodeInputs(node);

    let variables = [];

    if (types.length) {
        variables = nodeInputs.filter((input) => types.includes(input.type));
    } else {
        variables = nodeInputs;
    }

    variables = variables.map((variable) => {
        return {
            name: variable.name,
            type: variable.type,
            label: variable.label,
            source: VARIABLE_SOURCE_NODE_INPUT,
        };
    });

    return variables;
}

export function getGlobalVariablesExpanded(globalVariables) {
    const globalVariablesExpanded = [];

    const getDataTypeByName = select(workflowStore).getDataTypeByName;

    Object.keys(globalVariables).forEach((variableName) => {
        const variable = globalVariables[variableName];

        globalVariablesExpanded.push({
            name: variableName,
            type: variable.type,
            label: variable.label,
            source: VARIABLE_SOURCE_GLOBAL,
        });
    });

    return globalVariablesExpanded;
}
