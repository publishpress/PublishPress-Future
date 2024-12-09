<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine;

use PublishPress\Future\Modules\Workflows\Interfaces\RuntimeVariablesHandlerInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\VariableResolverInterface;

class RuntimeVariablesHandler implements RuntimeVariablesHandlerInterface
{
    /**
     * @var array
     */
    private $runtimeVariables = [];

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

    public function extractPlaceholdersFromText($text)
    {
        $variables = [];
        preg_match_all('/{{(.*?)}}/', $text, $variables);

        return $variables[1];
    }

    public function replacePlaceholdersInText($text)
    {
        $variables = $this->extractPlaceholdersFromText($text);

        foreach ($variables as $variable) {
            $value = $this->getVariable($variable);

            $text = str_replace('{{' . $variable . '}}', $value, $text);
        }

        return $text;
    }

    private function getVariableValue(string $variableName, $dataSource)
    {
        // FIXME: Do we really need the VariableResolvers? Can't we just use the native PHP values?

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

        return '';
    }

    private function getVariableValueFromNestedVariable(string $variableName, $dataSource)
    {
        $variableName = explode('.', $variableName);

        if (count($variableName) === 1) {
            return $this->getVariableValue($variableName[0], $dataSource);
        } else {
            if (is_array($dataSource) && !isset($dataSource[$variableName[0]])) {
                return '';
            }

            if (is_object($dataSource)) {
                if (!isset($dataSource->{$variableName[0]})) {
                    return '';
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

        return '';
    }

    private function setVariableInNestedArray(string $variableName, $variableValue, &$dataSource)
    {
        $variableName = explode('.', $variableName);

        if (count($variableName) === 1) {
            $dataSource[$variableName[0]] = $variableValue;
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
