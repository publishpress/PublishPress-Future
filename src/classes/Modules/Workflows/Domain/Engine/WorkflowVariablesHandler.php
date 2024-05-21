<?php

namespace PublishPress\FuturePro\Modules\Workflows\Domain\Engine;

use Exception;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\WorkflowVariablesHandlerInterface;

class WorkflowVariablesHandler implements WorkflowVariablesHandlerInterface
{
    public function extractVariablePlaceholdersFromText($text)
    {
        $variables = [];
        preg_match_all('/{{(.*?)}}/', $text, $variables);

        return $variables[1];
    }

    public function replaceVariablesPlaceholdersInText($text, array $dataSources)
    {
        $variables = $this->extractVariablePlaceholdersFromText($text);

        foreach ($variables as $variable) {
            $value = $this->parseVariableValue($variable, $dataSources);

            $text = str_replace('{{' . $variable . '}}', $value, $text);
        }

        return $text;
    }

    public function parseVariableValue($variableName, array $dataSources)
    {
        $variableName = explode('.', $variableName);

        $variableSource = null;
        if (in_array($variableName[0], array_keys($dataSources))) {
            $variableSource = $dataSources[$variableName[0]];
            $variableName = array_slice($variableName, 1);
        } else {
            return $variableName;
        }

        $value = $variableSource;
        if (count($variableName) > 1) {
            foreach ($variableName as $variableNameSegment) {
                $value = $this->getValueFromVariable($variableNameSegment, $value);
            }
        } else if (count($variableName) === 1) {
            $value = $variableSource[$variableName[0]];
        }

        return $value;
    }

    public function getValueFromVariable($variableName, $variable)
    {
        if (is_array($variable) && isset($variable[$variableName])) {
            $variable = $variable[$variableName];
        } else if (is_object($variable) && isset($variable->{$variableName})) {
            $variable = $variable->{$variableName};
        } else {
            throw new Exception('Invalid data key: ' . $variableName . ' for data: ' . print_r($variable, true));
        }

        return $variable;
    }

    public function getGlobalVariables($workflow)
    {
        $globals = [];

        $globals['workflow'] = [
            'id' => $workflow->getId(),
            'title' => $workflow->getTitle(),
            'description' => $workflow->getDescription(),
            'modified_at' => $workflow->getModifiedAt(),
        ];


        $userData = [];
        $currentUser = wp_get_current_user();
        if ($currentUser->exists()) {
            $userData = [
                'id' => $currentUser->ID,
                'user_email' => $currentUser->user_email,
                'user_login' => $currentUser->user_login,
                'display_name' => $currentUser->display_name,
                'roles' => $currentUser->roles,
                'caps' => $currentUser->caps,
                'user_registered' => $currentUser->user_registered,
            ];
        }
        $globals['user'] = $userData;

        $globals['site'] = [
            'url' => get_site_url(),
            'home_url' => get_home_url(),
            'admin_email' => get_option('admin_email'),
            'name' => get_option('blogname'),
            'description' => get_option('blogdescription'),
        ];

        $globals['trigger'] = [
            'id' => 0,
            'name' => '',
            'label' => '',
        ];

        return $globals;
    }
}
