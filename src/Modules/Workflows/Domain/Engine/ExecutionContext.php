<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine;

use PhpParser\Node\Expr\Instanceof_;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\HooksAbstract;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\ExecutionContextProcessorRegistryInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\VariableResolverInterface;

use function wp_json_encode;

class ExecutionContext implements ExecutionContextInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var ExecutionContextProcessorRegistryInterface
     */
    private $processorRegistry;

    /**
     * @var array
     */
    private $runtimeVariables = [];

    /**
     * @var array
     */
    private $executionTrace = [];

    public function __construct(
        HookableInterface $hooks,
        ExecutionContextProcessorRegistryInterface $processorRegistry
    ) {
        $this->hooks = $hooks;
        $this->processorRegistry = $processorRegistry;
    }

    public function setAllVariables(array $runtimeVariables)
    {
        $this->runtimeVariables = $runtimeVariables;
    }

    public function getAllVariables(): array
    {
        return $this->runtimeVariables;
    }

    public function getVariable(string $variableName)
    {
        return $this->getVariableValueFromNestedVariable($variableName, $this->runtimeVariables);
    }

    public function setVariable(string $variableName, $variableValue)
    {
        if (strpos($variableName, '.') !== false) {
            $this->setVariableInNestedArray($variableName, $variableValue, $this->runtimeVariables);
        } else {
            $this->runtimeVariables[$variableName] = $variableValue;
        }
    }

    /**
     * @since 4.3.4
     */
    public function extractExpressionsFromText(string $text): array
    {
        $expressions = [];
        preg_match_all('/{{(.*?)}}/', $text, $expressions);

        return $expressions[1];
    }

    /**
     * @since 4.3.4
     */
    public function resolveExpressionsInText(string $text): string
    {
        $expressions = $this->extractExpressionsFromText($text);

        foreach ($expressions as $expression) {
            if ($expressionElements = $this->variableHasHelper($expression)) {
                $value = $this->getVariable($expressionElements['variable']);
                $value = $this->processorRegistry->process($expressionElements['helper'], $value, $expressionElements['args']);
            } else {
                $value = $this->getVariable($expression);
            }

            if (is_array($value) || is_object($value)) {
                $value = wp_json_encode($value);
            }

            $text = str_replace('{{' . $expression . '}}', $value, $text);
        }

        return $text;
    }

    /**
     * @since 4.3.4
     */
    public function resolveExpressionsInArray(array $array): array
    {
        if (empty($array)) {
            return $array;
        }

        return array_map(fn ($item) => $this->resolveExpressionsInText($item), $array);
    }

    /**
     * @deprecated 4.3.4 Use extractExpressionsFromText instead.
     */
    public function extractPlaceholdersFromText($text)
    {
        return $this->extractExpressionsFromText($text);
    }

    /**
     * @deprecated 4.3.4 Use extractExpressionsFromText instead.
     */
    public function replacePlaceholdersInText($text)
    {
        return $this->resolveExpressionsInText($text);
    }

    /**
     * Recursively replaces variables in JSON Logic expressions with their values.
     *
     * @since 4.3.4
     */
    public function resolveExpressionsInJsonLogic(array $jsonLogicExpression): array
    {
        $newExpression = [];

        foreach ($jsonLogicExpression as $key => $value) {
            if (is_array($value)) {
                if (isset($value['var'])) {
                    $value = $value['var'];
                } else {
                    $value = $this->resolveExpressionsInJsonLogic($value);
                    if (is_bool($value)) {
                        $value = $value ? '1' : '0';
                    }
                }
            }

            if (is_string($value) && strpos($value, '{{') !== false) {
                $value = $this->resolveExpressionsInText($value);
            }

            $newExpression[$key] = $value;
        }

        return $newExpression;
    }

    private function variableHasHelper(string $variableName)
    {
        $helperRegex = '/^([a-zA-Z0-9_]+)\s+([a-zA-Z0-9_\.]+)\s*(.*)$/';

        $matches = [];
        preg_match($helperRegex, $variableName, $matches);

        if (empty($matches)) {
            return false;
        }

        $arguments = [];

        // Extract arguments if they exist in the third capture group
        if (!empty($matches[3])) {
            $argsString = trim($matches[3]);

            // Regex to match key-value pairs like key="value" or key='value' or key=value
            $argsRegex = '/([a-zA-Z0-9_\-]+)\s*=\s*(?:(?:"([^"]*)")|(?:\'([^\']*)\')|([^\s]+))/';

            $argMatches = [];
            preg_match_all($argsRegex, $argsString, $argMatches, PREG_SET_ORDER);

            foreach ($argMatches as $argMatch) {
                $key = $argMatch[1];
                // Get the value from whichever capturing group matched (double quotes, single quotes, or no quotes)
                $value = $argMatch[2] ?? $argMatch[3] ?? $argMatch[4] ?? '';
                $arguments[$key] = $value;
            }
        }

        return [
            'helper' => $matches[1],
            'variable' => $matches[2],
            'args' => $arguments,
        ];
    }

    private function getVariableValue(string $variableName, $dataSource)
    {
        if (is_array($dataSource) && isset($dataSource[$variableName])) {
            if (
                is_object($dataSource[$variableName]) &&
                $dataSource[$variableName] instanceof VariableResolverInterface
            ) {
                return $dataSource[$variableName]->getValue();
            }

            return $dataSource[$variableName];
        } elseif (is_object($dataSource) && $dataSource instanceof VariableResolverInterface) {
            return $dataSource->getValue($variableName);
        } elseif (is_object($dataSource) && isset($dataSource->{$variableName})) {
            return $dataSource->{$variableName};
        }

        return (string) $variableName;
    }

    private function getVariableValueFromNestedVariable(string $variableName, $dataSource)
    {
        $variableName = trim($variableName, '{}');

        /**
         * @param string $variableName
         * @param mixed $dataSource
         *
         * @since 4.3.4
         *
         * @return string
         */
        $variableName = $this->hooks->applyFilters(
            HooksAbstract::FILTER_WORKFLOW_ROUTE_VARIABLE,
            $variableName,
            $dataSource
        );

        $originalVariableName = $variableName;
        $variableName = explode('.', $variableName);

        if (count($variableName) === 1) {
            return $this->getVariableValue($variableName[0], $dataSource);
        } else {
            if (is_array($dataSource) && !isset($dataSource[$variableName[0]])) {
                return $originalVariableName;
            }

            if (is_object($dataSource)) {
                if (!isset($dataSource->{$variableName[0]})) {
                    return $originalVariableName;
                }
            }

            if (is_array($dataSource)) {
                $currentVariableSource = $dataSource[$variableName[0]];
            } else {
                $currentVariableSource = $dataSource->{$variableName[0]};
            }

            $variableName = array_slice($variableName, 1);

            return $this->getVariableValueFromNestedVariable(
                implode('.', $variableName),
                $currentVariableSource
            );
        }

        return $originalVariableName;
    }

    private function setVariableInNestedArray(string $variableName, $variableValue, &$dataSource)
    {
        $variableName = explode('.', $variableName);

        if (count($variableName) === 1) {
            if (is_array($dataSource)) {
                $dataSource[$variableName[0]] = $variableValue;
            } elseif (is_object($dataSource) && $dataSource instanceof VariableResolverInterface) {
                $dataSource->setValue($variableName[0], $variableValue);
            } else {
                $dataSource->{$variableName[0]} = $variableValue;
            }
        } else {
            if (!isset($dataSource[$variableName[0]])) {
                $dataSource[$variableName[0]] = [];
            }

            $this->setVariableInNestedArray(
                implode('.', array_slice($variableName, 1)),
                $variableValue,
                $dataSource[$variableName[0]]
            );
        }
    }
}
