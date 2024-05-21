<?php

namespace PublishPress\FuturePro\Modules\Workflows\Interfaces;


interface WorkflowVariablesHandlerInterface
{
    public function extractVariablePlaceholdersFromText($text);

    public function replaceVariablesPlaceholdersInText($text, array $variables);

    public function parseVariableValue($variableName, array $dataSources);

    public function getValueFromVariable($variableName, $variable);

    public function getGlobalVariables($workflow);
}
