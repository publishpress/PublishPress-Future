<?php

namespace PublishPress\FuturePro\Modules\Workflows\Controllers;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\FuturePro\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\FuturePro\Modules\Workflows\Interfaces\RestApiManagerInterface;

class RestApi implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var RestApiManagerInterface
     */
    private $restApiManager;

    public function __construct(HookableInterface $hooks, RestApiManagerInterface $restApiManager)
    {
        $this->hooks = $hooks;
        $this->restApiManager = $restApiManager;
    }

    public function initialize()
    {
        $this->hooks->addAction(
            CoreHooksAbstract::ACTION_REST_API_INIT,
            [$this->restApiManager, "register"]
        );
    }
}
