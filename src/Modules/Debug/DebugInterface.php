<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Debug;


interface DebugInterface
{
    /**
     * @param string $message
     * @return void
     */
    public function log($message);

    /**
     * @return void
     */
    public function dropDatabaseTable();

    /**
     * @return array
     */
    public function fetchAll();

    /**
     * @return void
     */
    public function deleteLogs();

    /**
     * @return bool
     */
    public function isEnabled();
}
