<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Interfaces;

interface RunnerInterface
{
    /**
     * @param int $postId
     * @return void
     */
    public function run($postId);
}
