<?php

namespace PublishPress\Future\Modules\Workflows\Interfaces;

interface RuntimeVariablesHandlerInterface
{
    public function setAllVariables(array $runtimeVariables);

    public function getAllVariables(): array;

    public function getVariable(string $variableName);

    public function setVariable(string $variableName, $variableValue);

    public function extractPlaceholdersFromText($text);

    public function replacePlaceholdersInText($text);
}
