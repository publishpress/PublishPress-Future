<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Debug;

use PublishPressFuture\Core\Framework\InitializableInterface;
use PublishPressFuture\Core\Framework\Logger\LoggerInterface;
use PublishPressFuture\Core\Framework\WordPress\Facade\HooksFacade;

class Controller implements InitializableInterface
{
    /**
     * @var HooksFacade
     */
    private $hooks;

    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(HooksFacade $hooks, LoggerInterface $logger)
    {
        $this->hooks = $hooks;
        $this->logger = $logger;
    }

    public function initialize()
    {
        $this->hooks->addAction(AbstractHooks::ACTION_DEBUG_LOG, [$this, 'onActionDebugLog']);
    }

    public function onActionDebugLog($message)
    {
        $this->logger->debug($message);
    }
}
