<?php

namespace PublishPress\Future\Modules\Workflows\Rest;

use PublishPress\Future\Modules\Settings\SettingsFacade;
use PublishPress\Future\Modules\Workflows\Interfaces\RestApiManagerInterface;

class RestApiManager implements RestApiManagerInterface
{
    public const API_BASE = 'publishpress-future';

    /**
     * @var SettingsFacade
     */
    private SettingsFacade $settingsFacade;

    public function __construct(SettingsFacade $settingsFacade)
    {
        $this->settingsFacade = $settingsFacade;
    }

    public function register()
    {
        $apiManagers = [
            new RestApiV1(
                $this->settingsFacade
            )
        ];

        foreach ($apiManagers as $apiManater) {
            $apiManater->register();
        }
    }
}
