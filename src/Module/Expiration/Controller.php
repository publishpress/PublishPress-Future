<?php

namespace PublishPressFuture\Module\Expiration;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Core\InitializableInterface;
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
     * @param HookableInterface $hooksFacade
     * @param SiteFacade $siteFacade
     */
    public function __construct(HookableInterface $hooksFacade, $siteFacade)
    {
        $this->hooks = $hooksFacade;
        $this->site = $siteFacade;
    }

    public function initialize()
    {
        $this->hooks->addAction(SettingsHooksAbstract::ACTION_DELETE_ALL_SETTINGS, [$this, 'onDeleteAllSettings']);
    }

    public function onDeleteAllSettings()
    {
        // TODO: What about custom post types? How to clean up?

        if ($this->site->isMultisite()) {
            wp_clear_scheduled_hook('expirationdate_delete_' . $this->site->getBlogId());
            return;
        }

        wp_clear_scheduled_hook('expirationdate_delete');
    }
}
