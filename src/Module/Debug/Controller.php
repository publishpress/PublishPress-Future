<?php

namespace PublishPressFuture\Module\Debug;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Core\InitializableInterface;

class Controller implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @param HookableInterface $hooks
     */
    public function __construct(HookableInterface $hooks)
    {
        $this->hooks = $hooks;
    }

    public function initialize()
    {

    }
}
