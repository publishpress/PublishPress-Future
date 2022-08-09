<?php

namespace PublishPressFuture\Modules\Expirator;

use PublishPressFuture\Core\Framework\InitializableInterface;
use PublishPressFuture\Core\Framework\WordPress\Facade\CronFacade;
use PublishPressFuture\Core\Framework\WordPress\Facade\SiteFacade;
use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Modules\Expirator\Interfaces\RunnerInterface;
use PublishPressFuture\Modules\Expirator\Interfaces\SchedulerInterface;
use PublishPressFuture\Modules\Settings\HooksAbstract as SettingsHooksAbstract;

class Controller implements InitializableInterface
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
     * @var CronFacade
     */
    private $cron;

    /**
     * @var ExpirationRunner
     */
    private $runner;

    /**
     * @var ExpirationScheduler
     */
    private $scheduler;

    /**
     * @param HookableInterface $hooksFacade
     * @param SiteFacade $siteFacade
     * @param CronFacade $cronFacade
     * @param RunnerInterface $runner
     * @param SchedulerInterface $scheduler
     */
    public function __construct(HookableInterface $hooksFacade, $siteFacade, $cronFacade, $runner, $scheduler)
    {
        $this->hooks = $hooksFacade;
        $this->site = $siteFacade;
        $this->cron = $cronFacade;
        $this->runner = $runner;
        $this->scheduler = $scheduler;
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
    }

    public function onActionDeleteAllSettings()
    {
        // TODO: What about custom post types? How to clean up?

        if ($this->site->isMultisite()) {
            $this->cron->clearScheduledHook('expirationdate_delete_' . $this->site->getBlogId());
            return;
        }

        $this->cron->clearScheduledHook('expirationdate_delete');
    }

    public function onActionSchedulePostExpiration($postId, $timestamp, $opts)
    {
        $this->scheduler->schedule($postId, $timestamp, $opts);
    }

    public function onActionUnschedulePostExpiration($postId)
    {
        $this->scheduler->unschedule($postId);
    }
}
