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

class WPCronToActionsScheduler implements MigrationInterface
{
    public const HOOK = ExpiratorHooks::ACTION_MIGRATE_WPCRON_EXPIRATIONS;

    /**
     * @var \PublishPressFuture\Modules\Expirator\Interfaces\CronInterface
     */
    private $cronAdapter;

    private $hooksFacade;

    /**
     * @param \PublishPressFuture\Modules\Expirator\Interfaces\CronInterface $cronAdapter
     * @param \PublishPressFuture\Core\HookableInterface $hooksFacade
     */
    public function __construct(
        CronInterface $cronAdapter,
        HookableInterface $hooksFacade
    ) {
        $this->cronAdapter = $cronAdapter;
        $this->hooksFacade = $hooksFacade;

        $this->hooksFacade->addAction(self::HOOK, [$this, 'migrate']);
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

            $this->cronAdapter->scheduleSingleAction(
                $eventData['time'],
                HooksAbstract::ACTION_RUN_WORKFLOW,
                [
                    'postId' => $postId,
                    'action' => 'expire',
                ]
            );

            wp_unschedule_event($eventData['time'], $eventData['hook'], $eventData['args']);
        }
    }
}
