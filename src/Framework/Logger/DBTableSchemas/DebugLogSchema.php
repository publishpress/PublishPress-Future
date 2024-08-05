<?php

namespace PublishPress\Future\Framework\Logger\DBTableSchemas;

use PublishPress\Future\Core\HookableInterface;
use PublishPress\Future\Framework\Database\Interfaces\DBTableSchemaHandlerInterface;
use PublishPress\Future\Framework\Database\Interfaces\DBTableSchemaInterface;

defined('ABSPATH') or die('Direct access not allowed.');

class DebugLogSchema implements DBTableSchemaInterface
{
    public const HEALTH_ERROR_TABLE_DOES_NOT_EXIST = 'table_does_not_exist';
    public const HEALTH_ERROR_INVALID_INDEX = 'invalid_index';

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
        $this->handler->setTableName('postexpirator_debug');

        $this->hooks = $hooks;
    }

    public function getTableName(): string
    {
        return $this->handler->getTableName();
    }

    private function getColumns(): array
    {
        return [
            'id' => 'int(9) NOT NULL AUTO_INCREMENT',
            'timestamp' => 'timestamp NOT NULL',
            'blog' => 'int(9) NOT NULL',
            'message' => "text NOT NULL",
        ];
    }

    private function getIndexes(): array
    {
        return [
            'PRIMARY' => ['id'],
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
            $tablePrefix = $this->handler->getTablePrefix();

            $this->handler->registerError(
                self::HEALTH_ERROR_TABLE_DOES_NOT_EXIST,
                sprintf(
                    __(
                        'The table %s does not exist.',
                        'post-expirator'
                    ),
                    $tablePrefix . 'ppfuture_actions_args'
                )
            );
        }

        $indexesErrors = $this->handler->checkTableIndexes($this->getIndexes());
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

    public function fixTable(): void
    {
        if (! $this->isTableExistent()) {
            $this->createTable();
        }

        if (! empty($this->handler->checkTableIndexes($this->getIndexes()))) {
            $this->handler->fixIndexes($this->getIndexes());
        }
    }
}
