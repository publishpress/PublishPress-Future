<?php

namespace PublishPressFuture\Modules\Expirator;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Core\InitializableInterface;
use PublishPressFuture\Core\WordPress\CronFacade;
use PublishPressFuture\Core\WordPress\SiteFacade;
use PublishPressFuture\Modules\Expirator\Hooks\ActionsAbstract;
use PublishPressFuture\Modules\Settings\Hooks\ActionsAbstract as SettingsHooksAbstract;

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
     * @var Scheduler
     */
    private $scheduler;

    /**
     * @param HookableInterface $hooksFacade
     * @param SiteFacade $siteFacade
     * @param CronFacade $cronFacade
     * @param CronFacade $schedulerFacade
     */
    public function __construct(HookableInterface $hooksFacade, $siteFacade, $cronFacade, $schedulerFacade)
    {
        $this->hooks = $hooksFacade;
        $this->site = $siteFacade;
        $this->cron = $cronFacade;
        $this->scheduler = $schedulerFacade;
    }

    public function initialize()
    {
        $this->hooks->addAction(SettingsHooksAbstract::DELETE_ALL_SETTINGS, [$this, 'onDeleteAllSettings']);
        $this->hooks->addAction(ActionsAbstract::SCHEDULE_POST_EXPIRATION, [$this, 'schedulePostExpiration'], 10, 3);
        $this->hooks->addAction(ActionsAbstract::UNSCHEDULE_POST_EXPIRATION, [$this, 'unschedulePostExpiration']);
    }

    public function onDeleteAllSettings()
    {
        // TODO: What about custom post types? How to clean up?

        if ($this->site->isMultisite()) {
            $this->cron->clearScheduledHook('expirationdate_delete_' . $this->site->getBlogId());
            return;
        }

        $this->cron->clearScheduledHook('expirationdate_delete');
    }

    public function schedulePostExpiration($postId, $timestamp, $opts)
    {
        $this->scheduler->scheduleExpirationForPost($postId, $timestamp, $opts);
    }

    public function unschedulePostExpiration($postId)
    {
        $this->scheduler->unscheduleExpirationForPost($postId);
    }
}
