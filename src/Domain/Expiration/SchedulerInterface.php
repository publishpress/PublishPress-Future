<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Module\Expiration;

interface SchedulerInterface
{
    /**
     * @param int $postId
     * @param int $timestamp
     * @param array $opts
     * @return void
     */
    public function scheduleExpirationForPost($postId, $timestamp, $opts);
}