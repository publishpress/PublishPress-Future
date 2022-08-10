<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Debug;


use PublishPressFuture\Framework\Logger\LoggerInterface;

class Debug implements DebugInterface
{
    /**
     * @var LoggerInterface
     */
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
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
        return true;
    }
}
