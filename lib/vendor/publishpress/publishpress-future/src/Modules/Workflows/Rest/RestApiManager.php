<?php

namespace PublishPress\Future\Modules\Workflows\Rest;

use PublishPress\Future\Modules\Workflows\Interfaces\RestApiManagerInterface;

class RestApiManager implements RestApiManagerInterface
{
    public const API_BASE = 'publishpress-future';

    public function register()
    {
        $apiManagers = [
            new RestApiV1()
        ];

        foreach ($apiManagers as $apiManater) {
            $apiManater->register();
        }
    }
}
