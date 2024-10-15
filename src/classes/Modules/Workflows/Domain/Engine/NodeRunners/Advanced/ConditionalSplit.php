<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine\NodeRunners\Advanced;

use JWadhams\JsonLogic;
use PublishPress\Future\Modules\Workflows\Domain\NodeTypes\Advanced\ConditionalSplit as NodeType;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\NodeRunnerProcessorInterface;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;

class ConditionalSplit implements NodeRunnerInterface
{
    /**
     * @var NodeRunnerProcessorInterface
     */
    private $nodeRunnerProcessor;

    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var RuntimeVariablesHandlerInterface
     */
    private $variablesHandler;

    public function __construct(
        HookableInterface $hooks,
        NodeRunnerProcessorInterface $nodeRunnerProcessor,
        RuntimeVariablesHandlerInterface $variablesHandler
    ) {
        $this->nodeRunnerProcessor = $nodeRunnerProcessor;
        $this->hooks = $hooks;
        $this->variablesHandler = $variablesHandler;
    }

    public static function getNodeTypeName(): string
    {
        return NodeType::getNodeTypeName();
    }

    public function setup(array $step): void
    {
        $this->hooks->doAction(HooksAbstract::ACTION_WORKFLOW_ENGINE_RUNNING_STEP, $step);

        $expression = $step['node']['data']['settings']['conditions']['json'];

        // Extract all the needed variables from the expression
        $variables = $this->extractVariablesFromExpression(json_encode($expression));

        $variablesValues = [];

        foreach ($variables as $variable) {
            $variablesValues[$variable] = $this->variablesHandler->getVariable($variable);
        }

        $variablesValues = $this->expandVariables($variablesValues);

        $conditionResult = JsonLogic::apply($expression, $variablesValues);

        $branch = $conditionResult ? 'true' : 'false';

        $nodeSlug = $this->nodeRunnerProcessor->getSlugFromStep($step);

        $this->variablesHandler->setVariable($nodeSlug, [
            'branch' => $branch,
        ]);

        if (isset($step['next'][$branch])) {
            $nextSteps = $step['next'][$branch];
        } else {
            $nextSteps = [];
        }

        foreach ($nextSteps as $nextStep) {
            /**
             * @var array $nextStep
             */
            $this->hooks->doAction(HooksAbstract::ACTION_EXECUTE_NODE, $nextStep);
        }
    }

    /**
     * Run into a JSONLogic expression array recursively and extract all the variable names.
     *
     * @param string $expression
     * @return array
     */
    private function extractVariablesFromExpression(string $expression): array
    {
        $variables = [];

        // Expression is a JSONLogic expression
        // We need to extract all the variables from the expression
        $runtimeVariables = array_keys($this->variablesHandler->getAllVariables());

        foreach ($runtimeVariables as $runtimeVariable) {
            if (strpos($expression, '"' . $runtimeVariable) !== false) {
                preg_match_all('/"(' . $runtimeVariable . '\.[a-z0-9\._]*)"/', $expression, $matches);

                $variables = array_merge($variables, $matches[1]);
            }
        }

        return $variables;
    }

    private function expandVariables(array $variablesValues): array
    {
        $expandedVariables = [];

        foreach ($variablesValues as $variable => $value) {
            $variableParts = explode('.', $variable);
            $currentLevel = &$expandedVariables;

            foreach ($variableParts as $variablePart) {
                $currentLevel[$variablePart] = [];

                $currentLevel = &$currentLevel[$variablePart];
            }

            $currentLevel = $value;
        }

        return $expandedVariables;
    }
}
