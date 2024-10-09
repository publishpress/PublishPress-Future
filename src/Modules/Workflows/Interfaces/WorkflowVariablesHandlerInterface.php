<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface WorkflowVariablesHandlerInterface
{
    public function extractVariablePlaceholdersFromText($text);

    public function replaceVariablesPlaceholdersInText($text, array $variables);

    public function parseNestedVariableValue(string $nestedVariableName, $dataSources);

    public function getVariablesValue($variableName, $variable);

    public function getGlobalVariables(WorkflowModelInterface $workflow);
}
