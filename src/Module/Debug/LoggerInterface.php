<?php

namespace PublishPressFuture\Module\Debug;

use Psr\Log\LoggerInterface as LogLoggerInterface;
use PublishPressFuture\Core\InitializableInterface;

interface LoggerInterface extends InitializableInterface, LogLoggerInterface
{
    /**
     * @return array
     */
    public function fetchEntries();

    /**
     * @return void
     */
    public function deleteLogs();
}
