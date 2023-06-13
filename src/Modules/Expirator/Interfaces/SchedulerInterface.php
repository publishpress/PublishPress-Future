<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Interfaces;

defined('ABSPATH') or die('Direct access not allowed.');

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
    public function postIsScheduled($postId);
}
