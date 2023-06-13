<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Debug;


use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Framework\ModuleInterface;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Modules\Debug\Controllers\Controller;

defined('ABSPATH') or die('Direct access not allowed.');

class Module implements ModuleInterface
{
    /**
     * @var HooksFacade
     */
    private $hooks;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var Controller
     */
    private $controller;

    /**
     * @param HooksFacade $hooks
     * @param LoggerInterface $logger
     */
    public function __construct(HooksFacade $hooks, LoggerInterface $logger)
    {
        $this->hooks = $hooks;
        $this->logger = $logger;

        $this->controller = $this->getController();
    }

    /**
     * @inheritDoc
     */
    public function initialize()
    {
        $this->controller->initialize();
    }

    private function getController()
    {
        return new Controller($this->hooks, $this->logger);
    }
}
