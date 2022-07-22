<?php

namespace PublishPressFuture\Core;

use Psr\Log\LoggerInterface as LogLoggerInterface;
use PublishPressFuture\Core\InitializableInterface;

interface LoggerInterface extends InitializableInterface, LogLoggerInterface
{
    /**
     * @return array
     */
    public function fetchAll();

    /**
     * @return void
     */
    public function deleteLogs();

    /**
     * @return void
     */
    public function dropDatabaseTable();
}
