<?php

namespace PublishPress\Future\Modules\Workflows\Rest;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Workflows\Interfaces\RestApiManagerInterface;

class RestApiManager implements RestApiManagerInterface
{
    public const API_BASE = 'publishpress-future';

    /**
     * @var HookableInterface
     */
    private HookableInterface $hooks;

    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;
    }

    public function register()
    {
        $apiManagers = [
            new RestApiV1(
                $this->hooks
            )
        ];

        foreach ($apiManagers as $apiManater) {
            $apiManater->register();
        }
    }
}
