/**
 * @typedef {'auto'|'manual'|'confirm'} StepType
 */

/**
 * @typedef {object} StepDefinition
 * @property {string} id
 * @property {string} label
 * @property {string} [phase]
 * @property {StepType} type
 * @property {boolean} [critical]
 * @property {(ctx: import('../engine/context.mjs').Context) => Promise<void>} [run]
 * @property {(ctx: import('../engine/context.mjs').Context) => Promise<void>} [setup]
 * @property {(ctx: import('../engine/context.mjs').Context) => boolean} [skip]
 * @property {string | ((ctx: import('../engine/context.mjs').Context) => string)} [instructions]
 * @property {string | ((ctx: import('../engine/context.mjs').Context) => string)} [message]
 */

export {};
