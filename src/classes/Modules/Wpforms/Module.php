<?php

namespace PublishPress\FuturePro\Modules\Wpforms;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;

class Module implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct(
        HookableInterface $hooksFacade
    ) {
        $this->hooks = $hooksFacade;
    }

    public function initialize()
    {
        $this->initializeControllers();
    }

    private function initializeControllers()
    {
        $controllers = [
            new Controllers\PostSubmission($this->hooks),
        ];

        foreach ($controllers as $controller) {
            $controller->initialize();
        }
    }
}
