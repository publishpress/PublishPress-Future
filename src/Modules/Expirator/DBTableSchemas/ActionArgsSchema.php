<?php

namespace PublishPress\Future\Modules\Expirator\DBTableSchemas;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Modules\Expirator\HooksAbstract;
use PublishPress\Future\Modules\Expirator\Interfaces\DBTableSchemaHandlerInterface;
use PublishPress\Future\Modules\Expirator\Interfaces\DBTableSchemaInterface;

defined('ABSPATH') or die('Direct access not allowed.');

class ActionArgsSchema implements DBTableSchemaInterface
{
    const HEALTH_ERROR_TABLE_DOES_NOT_EXIST = 'table_does_not_exist';
    const HEALTH_ERROR_COLUMN_ARGS_LENGTH_NOT_UPDATED = 'column_args_length_not_updated';
    const HEALTH_ERROR_INVALID_INDEX = 'invalid_index';

    /**
     * @var DBTableSchemaHandlerInterface
     */
    private $handler;

    /**
     * @var HookableInterface
     */
    private $hooks;

    public function __construct(DBTableSchemaHandlerInterface $handler, HookableInterface $hooks)
    {
        $this->handler = $handler;
        $this->handler->setTableName('ppfuture_actions_args');

        $this->hooks = $hooks;
    }

    public function getTableName(): string
    {
        return $this->handler->getTableName();
    }

    private function getColumns(): array
    {
        return [
            'id' => 'bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT',
            'cron_action_id' => 'bigint(20) UNSIGNED NOT NULL',
            'post_id' => 'bigint(20) UNSIGNED NOT NULL',
            'enabled' => "tinyint(1) NOT NULL DEFAULT '0'",
            'scheduled_date' => 'datetime NOT NULL',
            'created_at' => 'datetime NOT NULL',
            'args' => 'varchar(1000) NOT NULL',
        ];
    }

    private function getIndexes(): array
    {
        return [
            'PRIMARY' => ['id'],
            'post_id' => ['post_id', 'id'],
            'enabled_post_id' => ['post_id', 'enabled', 'id'],
            'cron_action_id' => ['cron_action_id', 'id'],
            'enabled_cron_action_id' => ['cron_action_id', 'enabled', 'id'],
        ];
    }

    public function createTable(): bool
    {
        return $this->handler->createTable($this->getColumns(), $this->getIndexes());
    }

    public function dropTable(): bool
    {
        return $this->handler->dropTable();
    }

    public function isTableHealthy(): bool
    {
        $this->handler->resetErrors();

        if (! $this->isTableExistent()) {

            $this->handler->registerError(
                self::HEALTH_ERROR_TABLE_DOES_NOT_EXIST,
                __(
                    'The table _ppfuture_actions_args does not exist.',
                    'post-expirator'
                )
            );
        }

        if (! $this->checkColumnArgsLengthIs1000()) {
            $this->handler->registerError(
                self::HEALTH_ERROR_COLUMN_ARGS_LENGTH_NOT_UPDATED,
                __(
                    'The column args length was not updated to 1000.',
                    'post-expirator'
                )
            );
        }

        $indexesErrors = $this->handler->checkTableIndexes($this->getIndexes()  );
        if (! empty($indexesErrors)) {
            $this->handler->registerError(
                self::HEALTH_ERROR_INVALID_INDEX,
                __(
                    'The table indexes are invalid: ',
                    'post-expirator'
                ) . implode(', ', $indexesErrors)
            );
        }

        return false === $this->handler->hasErrors();
    }

    public function isTableExistent(): bool
    {
        return $this->handler->isTableExistent();
    }

    public function getErrors(): array
    {
        return $this->handler->getErrors();
    }

    private function checkColumnArgsLengthIs1000()
    {
        return $this->handler->getColumnLength('args') === 1000;
    }

    public function fixTable(): void
    {
        if (! $this->isTableExistent()) {
            $this->createTable();
        }

        if (! $this->checkColumnArgsLengthIs1000()) {
            $this->handler->changeColumn('args', 'varchar(1000) NOT NULL');
        }

        if (! empty($this->handler->checkTableIndexes($this->getIndexes()))) {
            $this->handler->fixIndexes($this->getIndexes());
        }
    }
}
