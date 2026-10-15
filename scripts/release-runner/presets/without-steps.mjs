/**
 * Return a copy of a step pipeline with given step ids removed.
 *
 * @param {import('./types.mjs').StepDefinition[]} pipeline
 * @param {string[]} stepIdsToOmit
 * @returns {import('./types.mjs').StepDefinition[]}
 */
export function withoutSteps(pipeline, stepIdsToOmit) {
  const omit = new Set(stepIdsToOmit);
  return pipeline.filter((step) => !omit.has(step.id));
}
