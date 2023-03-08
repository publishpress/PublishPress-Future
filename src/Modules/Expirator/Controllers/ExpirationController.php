<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Controllers;

use Closure;
use Exception;
use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Framework\InitializableInterface;
use PublishPressFuture\Framework\WordPress\Facade\SiteFacade;
use PublishPressFuture\Modules\Expirator\HooksAbstract;
use PublishPressFuture\Modules\Expirator\Interfaces\CronInterface;
use PublishPressFuture\Modules\Expirator\Interfaces\SchedulerInterface;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;
use PublishPressFuture\Modules\Settings\HooksAbstract as SettingsHooksAbstract;

class ExpirationController implements InitializableInterface
{
    /**
     * @var HookableInterface
     */
    private $hooks;

    /**
     * @var SiteFacade
     */
    private $site;

    /**
     * @var CronInterface
     */
    private $cron;

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
     * @param SiteFacade $siteFacade
     * @param CronInterface $cron
     * @param SchedulerInterface $scheduler
     * @param Closure $expirablePostModelFactory
     */
    public function __construct(
        HookableInterface $hooksFacade,
        SiteFacade $siteFacade,
        CronInterface $cron,
        SchedulerInterface $scheduler,
        Closure $expirablePostModelFactory
    ) {
        $this->hooks = $hooksFacade;
        $this->site = $siteFacade;
        $this->cron = $cron;
        $this->scheduler = $scheduler;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
    }

    public function initialize()
    {
        $this->hooks->addAction(
            SettingsHooksAbstract::ACTION_DELETE_ALL_SETTINGS,
            [$this, 'onActionDeleteAllSettings']
        );
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
            HooksAbstract::ACTION_LEGACY_EXPIRE_POST2,
            [$this, 'onActionRunPostExpiration']
        );
        $this->hooks->addAction(
            HooksAbstract::ACTION_LEGACY_EXPIRE_POST1,
            [$this, 'onActionRunPostExpiration']
        );
    }

    public function onActionDeleteAllSettings()
    {
        // TODO: What about custom post types? How to clean up?

        if ($this->site->isMultisite()) {
            $this->cron->clearScheduledAction(
                HooksAbstract::getActionLegacyMultisiteDelete($this->site->getBlogId())
            );

            return;
        }

        $this->cron->clearScheduledAction(HooksAbstract::ACTION_LEGACY_DELETE);
    }

    public function onActionSchedulePostExpiration($postId, $timestamp, $opts)
    {
        $this->scheduler->schedule($postId, $timestamp, $opts);
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

        if (! ($postModel instanceof ExpirablePostModel)) {
            throw new Exception('Invalid post model factory');
        }

        $postModel->expire($force);
    }
}
