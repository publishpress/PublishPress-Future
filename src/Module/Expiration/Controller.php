<?php

namespace PublishPressFuture\Module\Expiration;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Core\InitializableInterface;
use PublishPressFuture\Core\WordPress\CronFacade;
use PublishPressFuture\Core\WordPress\SiteFacade;
use PublishPressFuture\Module\Settings\HooksAbstract as SettingsHooksAbstract;

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
     * @param HookableInterface $hooksFacade
     * @param SiteFacade $siteFacade
     * @param CronFacade $cronFacade
     */
    public function __construct(HookableInterface $hooksFacade, $siteFacade, $cronFacade)
    {
        $this->hooks = $hooksFacade;
        $this->site = $siteFacade;
        $this->cron = $cronFacade;
    }

    public function initialize()
    {
        $this->hooks->addAction(SettingsHooksAbstract::ACTION_DELETE_ALL_SETTINGS, [$this, 'onDeleteAllSettings']);
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
}
