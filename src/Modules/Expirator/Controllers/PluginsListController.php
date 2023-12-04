<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Controllers;

use Closure;
use Exception;
use PublishPress\Future\Core\DI\Container;
use PublishPress\Future\Core\DI\ServicesAbstract;
use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Core\HooksAbstract as CoreHooksAbstract;
use PublishPress\Future\Framework\InitializableInterface;
use PublishPress\Future\Framework\WordPress\Facade\SiteFacade;
use PublishPress\Future\Modules\Expirator\Adapters\CronToWooActionSchedulerAdapter;
use PublishPress\Future\Modules\Expirator\CapabilitiesAbstract;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\Future\Modules\Expirator\Interfaces\SchedulerInterface;
use PublishPress\Future\Modules\Expirator\Models\ExpirablePostModel;
use PublishPress\Future\Modules\Expirator\Schemas\ActionArgsSchema;
use PublishPress\Future\Modules\Settings\HooksAbstract as SettingsHooksAbstract;
use PublishPress\Future\Modules\Settings\SettingsFacade;

defined('ABSPATH') or die('Direct access not allowed.');

class PluginsListController implements InitializableInterface
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
     * @var \Closure
     */
    private $settingsModelFactory;

    /**
     * @var TaxonomiesModel
     */
    private $taxonomiesModel;

    /**
     * @param HookableInterface $hooksFacade
     * @param SiteFacade $siteFacade
     * @param CronInterface $cron
     * @param SchedulerInterface $scheduler
     * @param Closure $expirablePostModelFactory
     * @param Closure $settingsModelFactory
     * @param Closure $taxonomiesModelFactory
     */
    public function __construct(
        HookableInterface $hooksFacade,
        SiteFacade $siteFacade,
        CronInterface $cron,
        SchedulerInterface $scheduler,
        Closure $expirablePostModelFactory,
        Closure $settingsModelFactory,
        Closure $taxonomiesModelFactory
    ) {
        $this->hooks = $hooksFacade;
        $this->site = $siteFacade;
        $this->cron = $cron;
        $this->scheduler = $scheduler;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->settingsModelFactory = $settingsModelFactory;
        $this->taxonomiesModel = $taxonomiesModelFactory();
    }

    public function initialize()
    {
        $this->hooks->addFilter(CoreHooksAbstract::FILTER_PLUGIN_ACTION_LINKS, [$this, 'addPluginActionLinks'], 10, 2);
    }

    public function addPluginActionLinks($links, $file)
    {
        $this_plugin = basename(PUBLISHPRESS_FUTURE_BASE_PATH) . '/post-expirator.php';
        if ($file === $this_plugin) {
            $links[] = '<a href="admin.php?page=publishpress-future">' . __('Settings', 'post-expirator') . '</a>';
        }

        return $links;
    }
}
