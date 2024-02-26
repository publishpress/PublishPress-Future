<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Controllers;

use Closure;
use Exception;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\Future\Modules\Expirator\Interfaces\SchedulerInterface;
use PublishPress\Future\Modules\Expirator\Models\ExpirablePostModel;

defined('ABSPATH') or die('Direct access not allowed.');

class ExpirationController implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var SchedulerInterface
     */
    private $scheduler;

    /**
     * @var Closure
     */
    private $expirablePostModelFactory;


    /**
     * @param HookableInterface $hooksFacade
     * @param SchedulerInterface $scheduler
     * @param Closure $expirablePostModelFactory
     */
    public function __construct(
        HookableInterface $hooksFacade,
        SchedulerInterface $scheduler,
        Closure $expirablePostModelFactory
    ) {
        $this->hooks = $hooksFacade;
        $this->scheduler = $scheduler;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
    }

    public function initialize()
    {
        $this->hooks->addAction(
            HooksAbstract::ACTION_SCHEDULE_POST_EXPIRATION,
            [$this, 'onActionSchedulePostExpiration'],
            10,
            3
        );
        $this->hooks->addAction(
            HooksAbstract::ACTION_UNSCHEDULE_POST_EXPIRATION,
            [$this, 'onActionUnschedulePostExpiration']
        );
        $this->hooks->addAction(
            HooksAbstract::ACTION_RUN_WORKFLOW,
            [$this, 'onActionRunPostExpiration']
        );
        $this->hooks->addAction(
            HooksAbstract::ACTION_LEGACY_RUN_WORKFLOW,
            [$this, 'onActionRunPostExpiration']
        );
    }

    public function onActionSchedulePostExpiration($postId, $timestamp, $opts)
    {
        $this->scheduler->schedule((int)$postId, (int)$timestamp, $opts);
    }

    public function onActionUnschedulePostExpiration($postId)
    {
        $this->scheduler->unschedule($postId);
    }

    /**
     * @throws \Exception
     */
    public function onActionRunPostExpiration($postId, $force = false)
    {
        $postModelFactory = $this->expirablePostModelFactory;

        $postModel = $postModelFactory($postId);

        if (!($postModel instanceof ExpirablePostModel)) {
            throw new Exception('Invalid post model factory');
        }

        $postModel->expire($force);
    }
}
