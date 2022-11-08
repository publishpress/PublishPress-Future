<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Interfaces;

interface SchedulerInterface
{
    /**
     * @param int $postId
     * @param int $timestamp
     * @param array $opts
     * @return void
     */
    public function schedule($postId, $timestamp, $opts);

    /**
     * @param int $postId
     * @return void
     */
    public function unschedule($postId);

    /**
     * @param int $postId
     * @return bool
     */
    public function isScheduled($postId);
}
