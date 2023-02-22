<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Interfaces;


interface ExpirationActionInterface
{
    /**
     * @return bool
     */
    public function execute();

    /**
     * @return string
     */
    public function getNotificationText();

    /**
     * @return string
     */
    public function __toString();
}
