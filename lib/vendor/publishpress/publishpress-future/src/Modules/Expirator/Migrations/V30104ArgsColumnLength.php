<?php
/**
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */

namespace PublishPress\Future\Modules\Expirator\Migrations;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract as ExpiratorHooks;
use PublishPress\Future\Modules\Expirator\Interfaces\MigrationInterface;
use PublishPress\Future\Modules\Expirator\Schemas\ActionArgsSchema;

use function tad\WPBrowser\vendorDir;

defined('ABSPATH') or die('Direct access not allowed.');

class V30104ArgsColumnLength implements MigrationInterface
{
    const HOOK = ExpiratorHooks::ACTION_MIGRATE_ARGS_LENGTH;

    private $hooksFacade;

    /**
     * @param \PublishPress\Future\Core\HookableInterface $hooksFacade
     */
    public function __construct(HookableInterface $hooksFacade) {
        $this->hooksFacade = $hooksFacade;
        // TODO: Move this for a migration scheduler instead of add itself?
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
        $this->changeArgsColumnLength();
    }

    /**
     * @param string $text
     * @param array $row
     * @return string
     */
    public function formatLogActionColumn($text, $row)
    {
        if ($row['hook'] === self::HOOK) {
            return __('Change args column length to 1000 in the table _ppfuture_actions_args after v3.1.4', 'publishpress-future');
        }

        return $text;
    }

    private function changeArgsColumnLength()
    {
        global $wpdb;

        $tableName = ActionArgsSchema::getTableName();

        // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.SchemaChange
        $wpdb->query("ALTER TABLE `$tableName` MODIFY COLUMN args varchar(1000) NOT NULL");
    }
}
