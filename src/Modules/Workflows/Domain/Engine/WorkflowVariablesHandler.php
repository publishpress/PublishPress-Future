<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Engine;

use Exception;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\NodeResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\SiteResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\UserResolver;
use PublishPress\Future\Modules\Workflows\Domain\Engine\VariableResolvers\WorkflowResolver;
use PublishPress\Future\Modules\Workflows\Interfaces\VariableResolverInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\WorkflowVariablesHandlerInterface;

class WorkflowVariablesHandler implements WorkflowVariablesHandlerInterface
{
    public function extractVariablePlaceholdersFromText($text)
    {
        $variables = [];
        preg_match_all('/{{(.*?)}}/', $text, $variables);

        return $variables[1];
    }

    public function getVariablesValue($variableName, $variable)
    {
        if (is_array($variable) && isset($variable[$variableName])) {
            if (is_object($variable[$variableName]) && $variable[$variableName] instanceof VariableResolverInterface) {
                return $variable[$variableName]->getValueAsString();
            }

            return $variable[$variableName];
        } elseif (is_object($variable) && $variable instanceof VariableResolverInterface) {
            return $variable->getValueAsString($variableName);
        } elseif (is_object($variable) && isset($variable->{$variableName})) {
            return $variable->{$variableName};
        }

        return '';
    }

    public function parseNestedVariableValue(string $nestedVariableName, $dataSources)
    {
        $nestedVariableName = explode('.', $nestedVariableName);

        if (count($nestedVariableName) === 1) {
            return $this->getVariablesValue($nestedVariableName[0], $dataSources);
        } else {
            if (!isset($dataSources[$nestedVariableName[0]])) {
                return '';
            }

            $currentVariableSource = $dataSources[$nestedVariableName[0]];
            $nestedVariableName = array_slice($nestedVariableName, 1);

            return $this->parseNestedVariableValue(implode('.', $nestedVariableName), $currentVariableSource);
        }

        return '';
    }

    public function replaceVariablesPlaceholdersInText($text, array $dataSources)
    {
        $variables = $this->extractVariablePlaceholdersFromText($text);

        foreach ($variables as $variable) {
            $value = $this->parseNestedVariableValue($variable, $dataSources);

            $text = str_replace('{{' . $variable . '}}', $value, $text);
        }

        return $text;
    }

    public function getGlobalVariables($workflow)
    {
        return [
            'workflow' => $this->getWorkflowGlobal($workflow),
            'user' => $this->getUserGlobal(),
            'site' => $this->getSiteGlobal(),
            'trigger' => $this->getTriggerGlobal(),
        ];
    }

    protected function getWorkflowGlobal($workflow)
    {
        return new WorkflowResolver(
            [
                'id' => $workflow->getId(),
                'title' => $workflow->getTitle(),
                'description' => $workflow->getDescription(),
                'modified_at' => $workflow->getModifiedAt(),
            ]
        );
    }

    protected function getUserGlobal()
    {
        $currentUser = wp_get_current_user();

        return new UserResolver($currentUser);
    }

    protected function getSiteGlobal()
    {
        return new SiteResolver();
    }

    protected function getTriggerGlobal()
    {
        return new NodeResolver([]);
    }
}
