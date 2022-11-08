<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Debug\Controllers;

use PublishPressFuture\Framework\InitializableInterface;
use PublishPressFuture\Framework\Logger\LoggerInterface;
use PublishPressFuture\Framework\WordPress\Facade\HooksFacade;
use PublishPressFuture\Modules\Debug\HooksAbstract;

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
        $this->hooks->addAction(HooksAbstract::ACTION_DEBUG_LOG, [$this, 'onActionDebugLog']);
    }

    public function onActionDebugLog($message)
    {
        $this->logger->debug($message);
    }
}
