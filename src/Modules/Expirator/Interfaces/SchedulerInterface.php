<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Interfaces;

interface SchedulerInterface
{
    public function schedule(int $postId, int $timestamp, array $opts): void;

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
