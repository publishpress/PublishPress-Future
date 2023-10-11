<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Debug\Controllers;

use PublishPress\Future\Core\HooksAbstract as CoreAbstractHooks;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Framework\Logger\LoggerInterface;
use PublishPress\Future\Framework\WordPress\Facade\HooksFacade;
use PublishPress\Future\Modules\Debug\HooksAbstract;

defined('ABSPATH') or die('Direct access not allowed.');

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
        $this->hooks->addAction(HooksAbstract::ACTION_DEBUG_LOG, [$this, 'onDebugLog']);

        $this->hooks->addAction(
            CoreAbstractHooks::ACTION_DEACTIVATE_PLUGIN,
            [$this, 'onDeactivatePlugin']
        );
    }

    public function onDebugLog($message)
    {
        $this->logger->debug($message);
    }

    public function onDeactivatePlugin()
    {
        $preserveData = (bool)get_option('expirationdatePreserveData', 1);

        if (! $preserveData) {
            $this->logger->dropDatabaseTable();
        }
    }
}
