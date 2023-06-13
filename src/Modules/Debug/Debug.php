<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Debug;


use PublishPress\Future\Framework\Logger\LoggerInterface;

defined('ABSPATH') or die('Direct access not allowed.');

class Debug implements DebugInterface
{
    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var \PublishPress\Future\Modules\Settings\SettingsFacade
     */
    private $settings;

    public function __construct(LoggerInterface $logger, $settings)
    {
        $this->logger = $logger;
        $this->settings = $settings;
    }

    /**
     * @inheritDoc
     */
    public function log($message)
    {
        if ($this->isEnabled()) {
            $this->logger->debug($message);
        }
    }

    /**
     * @inheritDoc
     */
    public function dropDatabaseTable()
    {
        $this->logger->dropDatabaseTable();
    }

    /**
     * @inheritDoc
     */
    public function fetchAll()
    {
        return $this->logger->fetchAll();
    }

    /**
     * @inheritDoc
     */
    public function deleteLogs()
    {
        $this->logger->deleteLogs();
    }

    /**
     * @inheritDoc
     */
    public function isEnabled()
    {
        return $this->settings->getDebugIsEnabled();
    }
}
