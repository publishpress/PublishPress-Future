<?php
/**
 * Copyright (c) 2022. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Controllers;

use Closure;
use Exception;
use PublishPress\Future\Core\HookableInterface;
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
     * @var \Closure
     */
    private $settingsModelFactory;

    /**
     * @param HookableInterface $hooksFacade
     * @param SiteFacade $siteFacade
     * @param CronInterface $cron
     * @param SchedulerInterface $scheduler
     * @param Closure $expirablePostModelFactory
     * @param Closure $settingsModelFactory
     */
    public function __construct(
        HookableInterface $hooksFacade,
        SiteFacade $siteFacade,
        CronInterface $cron,
        SchedulerInterface $scheduler,
        Closure $expirablePostModelFactory,
        Closure $settingsModelFactory
    ) {
        $this->hooks = $hooksFacade;
        $this->site = $siteFacade;
        $this->cron = $cron;
        $this->scheduler = $scheduler;
        $this->expirablePostModelFactory = $expirablePostModelFactory;
        $this->settingsModelFactory = $settingsModelFactory;
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
            HooksAbstract::ACTION_LEGACY_EXPIRE_POST2,
            [$this, 'onActionRunPostExpiration']
        );
        $this->hooks->addAction(
            HooksAbstract::ACTION_LEGACY_EXPIRE_POST1,
            [$this, 'onActionRunPostExpiration']
        );
        $this->hooks->addAction(
            HooksAbstract::ACTION_REST_API_INIT,
            [$this, 'handleRestAPIInit']
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

        if (! ($postModel instanceof ExpirablePostModel)) {
            throw new Exception('Invalid post model factory');
        }

        $postModel->expire($force);
    }

    public function handleRestAPIInit()
    {
        $factory = $this->settingsModelFactory;
        $settingsModel = $factory();
        $settings = $settingsModel->getPostTypesSettings();

        $activePostTypes = array_filter($settings, function ($postTypeSettings) {
            return $postTypeSettings['active'];
        });
        $activePostTypes = array_keys($activePostTypes);

        foreach ($activePostTypes as $postType) {
            register_rest_field(
                $postType,
                'publishpress_future_action',
                [
                    'get_callback' => function ($post) {
                        $postModelFactory = $this->expirablePostModelFactory;
                        $postModel = $postModelFactory($post['id']);

                        $isEnabled = $postModel->isExpirationEnabled();

                        if ('auto-draft' === $post['status'] && ! $isEnabled) {
                            return [
                                'enabled' => false,
                                'date' => 0,
                                'action' => '',
                                'terms' => [],
                                'taxonomy' => '',
                                'browser_timezone_offset' => 0
                            ];
                        }

                        return [
                            'enabled' => $postModel->isExpirationEnabled(),
                            'date' => $postModel->getExpirationDateString(false),
                            'action' => $postModel->getExpirationType(),
                            'terms' => $postModel->getExpirationCategoryIDs(),
                            'taxonomy' => $postModel->getExpirationTaxonomy(),
                            'browser_timezone_offset' => 0
                        ];
                    },
                    'update_callback' => function ($value, $post) {
                        if (isset($value['enabled']) && (bool)$value['enabled']) {
                            $opts = [
                                'expireType' => $value['action'],
                                'category' => $value['terms'],
                                'categoryTaxonomy' => $value['taxonomy'],
                                'enabled' => true,
                            ];

                            $browserTimezoneOffset = (int)$value['browser_timezone_offset'] * MINUTE_IN_SECONDS;
                            $wpTimezoneOffset = get_option('gmt_offset') * HOUR_IN_SECONDS;

                            // The user believes he typed the date time in the site's timezone, but the DateTimePicker
                            // component sends the date time in the user's local timezone. We need to convert the date
                            // time to the site's timezone and then to UTC.
                            $gmtActionTime = $value['date'] - $browserTimezoneOffset - $wpTimezoneOffset;

                            do_action(HooksAbstract::ACTION_SCHEDULE_POST_EXPIRATION, $post->ID, $gmtActionTime, $opts);
                            return true;
                        }

                        do_action(HooksAbstract::ACTION_UNSCHEDULE_POST_EXPIRATION, $post->ID);

                        return true;
                    },
                    'schema' => [
                        'description' => 'Future action',
                        'type' => 'object',
                    ]
                ]
            );
        }
    }
}
