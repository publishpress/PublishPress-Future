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
 * @property {boolean} [publish] Changes master or publishes; the page asks to type the version before confirming
 * @property {string | ((ctx: import('../engine/context.mjs').Context) => string)} [command] Main shell command, shown before the step runs
 * @property {(ctx: import('../engine/context.mjs').Context) => Promise<void>} [run]
 * @property {(ctx: import('../engine/context.mjs').Context) => Promise<void>} [setup]
 * @property {(ctx: import('../engine/context.mjs').Context) => boolean} [skip]
 * @property {string | ((ctx: import('../engine/context.mjs').Context) => string)} [instructions]
 * @property {string | ((ctx: import('../engine/context.mjs').Context) => string)} [message]
 */

export {};
