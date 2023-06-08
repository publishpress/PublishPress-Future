<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Migrations;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooks;
use PublishPress\Future\Modules\Expirator\Interfaces\CronInterface;
use PublishPress\Future\Modules\Expirator\Interfaces\MigrationInterface;
use PublishPress\Future\Modules\Expirator\Schemas\ActionArgsSchema;

defined('ABSPATH') or die('Direct access not allowed.');

class V30000ActionArgsSchema implements MigrationInterface
{
    const HOOK = ExpiratorHooks::ACTION_MIGRATE_CREATE_ACTION_ARGS_SCHEMA;

    /**
     * @var \PublishPress\Future\Modules\Expirator\Interfaces\CronInterface
     */
    private $cronAdapter;

    private $hooksFacade;

    /**
     * @param \PublishPress\Future\Modules\Expirator\Interfaces\CronInterface $cronAdapter
     * @param \PublishPress\Future\Core\HookableInterface $hooksFacade
     */
    public function __construct(
        CronInterface $cronAdapter,
        HookableInterface $hooksFacade
    ) {
        $this->cronAdapter = $cronAdapter;
        $this->hooksFacade = $hooksFacade;

        $this->hooksFacade->addAction(self::HOOK, [$this, 'migrate']);
        $this->hooksFacade->addAction(
            ExpiratorHooks::FILTER_ACTION_SCHEDULER_LIST_COLUMN_HOOK,
            [$this, 'formatLogActionColumn'],
            10,
            2
        );
    }

    public function migrate()
    {
        ActionArgsSchema::createTableIfNotExists();
    }

    /**
     * @param string $text
     * @param array $row
     * @return string
     */
    public function formatLogActionColumn($text, $row)
    {
        if ($row['hook'] === self::HOOK) {
            return __('Migrate legacy actions arguments schema after v3.0.0', 'publishpress-future');
        }
        return $text;
    }
}
