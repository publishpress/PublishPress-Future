<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

namespace PublishPressFuture\Modules\Expirator\Migrations;

use PublishPressFuture\Core\HookableInterface;
use PublishPressFuture\Modules\Expirator\HooksAbstract;
use PublishPressFuture\Modules\Expirator\HooksAbstract as ExpiratorHooks;
use PublishPressFuture\Modules\Expirator\Interfaces\CronInterface;
use PublishPressFuture\Modules\Expirator\Interfaces\MigrationInterface;
use PublishPressFuture\Modules\Expirator\Models\ExpirablePostModel;
use PublishPressFuture\Modules\Expirator\Schemas\ActionArgsSchema;

class V30000WPCronToActionsScheduler implements MigrationInterface
{
    public const HOOK = ExpiratorHooks::ACTION_MIGRATE_WPCRON_EXPIRATIONS;

    /**
     * @var \PublishPressFuture\Modules\Expirator\Interfaces\CronInterface
     */
    private $cronAdapter;

    private $hooksFacade;

    /**
     * @var \Closure
     */
    private $expirablePostModelFactory;

    /**
     * @param \PublishPressFuture\Modules\Expirator\Interfaces\CronInterface $cronAdapter
     * @param \PublishPressFuture\Core\HookableInterface $hooksFacade
     */
    public function __construct(
        CronInterface $cronAdapter,
        HookableInterface $hooksFacade,
        \Closure $expirablePostModelFactory
    ) {
        $this->cronAdapter = $cronAdapter;
        $this->hooksFacade = $hooksFacade;

        ActionArgsSchema::createTableIfNotExists();

        $this->hooksFacade->addAction(self::HOOK, [$this, 'migrate']);
        $this->expirablePostModelFactory = $expirablePostModelFactory;
    }

    private function getLegacyScheduledActions(): array
    {
        $cron = _get_cron_array();
        $events = [];

        $pluginValidHooks = [
            ExpiratorHooks::ACTION_LEGACY_EXPIRE_POST2,
            ExpiratorHooks::ACTION_LEGACY_EXPIRE_POST1,
        ];

        foreach ($cron as $time => $value) {
            foreach ($value as $eventKey => $eventValue) {
                if (in_array($eventKey, $pluginValidHooks)) {
                    foreach ($eventValue as $eventGUID => $eventData) {
                        $events[] = [
                            'guid' => $eventGUID,
                            'hook' => $eventKey,
                            'time' => $time,
                            'args' => array_values($eventData['args']),
                        ];
                    }
                }
            }
        }

        return $events;
    }

    public function migrate(): void
    {
        $events = $this->getLegacyScheduledActions();

        foreach ($events as $eventData) {
            $postId = $eventData['args'][0];

            $postModel = ($this->expirablePostModelFactory)($postId);

            $expireType = $postModel->getMeta('_expiration-date-type', true);
            $expirationEnabled = $postModel->getMeta('_expiration-date-status', true) === 'saved';
            $expirationTaxonomy = $postModel->getMeta('_expiration-date-taxonomy', true);
            $expirationCategories = (array)$postModel->getMeta('_expiration-date-categories', true);

            $args = [
                'expireType' => $expireType,
                'category' => $expirationCategories,
                'categoryTaxonomy' => $expirationTaxonomy,
                'enabled' => $expirationEnabled,
                'date' => $eventData['time'],
            ];

            do_action(HooksAbstract::ACTION_SCHEDULE_POST_EXPIRATION, $postId, $eventData['time'], $args);

            $postModel->deleteMeta('_expiration-date-type');
            $postModel->deleteMeta('_expiration-date-status');
            $postModel->deleteMeta('_expiration-date-taxonomy');
            $postModel->deleteMeta('_expiration-date-categories');
            $postModel->deleteMeta('_expiration-date');
            $postModel->deleteMeta('_expiration-date-options');

            wp_unschedule_event($eventData['time'], $eventData['hook'], $eventData['args']);
        }
    }
}
