<?php

namespace PublishPressFuture\Modules\Expirator\Interfaces;


interface ExpirableActionInterface
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
     * @return array
     */
    public function getExpirationLog();
}
